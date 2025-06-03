import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus } from './notifications.entity';
import { Users } from '../users/user.entity';
import { Group } from '../groups/groups.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async createGroupInvitation(
    senderId: number,
    recipientId: number,
    groupId: number,
  ): Promise<Notification> {
    const sender = await this.userRepository.findOne({
      where: { iduser: senderId },
    });
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    const recipient = await this.userRepository.findOne({
      where: { iduser: recipientId },
    });
    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Check if there's already a pending invitation
    const existingInvitation = await this.notificationRepository.findOne({
      where: {
        sender: { iduser: senderId },
        recipient: { iduser: recipientId },
        group: { id: groupId },
        status: NotificationStatus.PENDING,
      },
    });

    if (existingInvitation) {
      throw new BadRequestException('Invitation already sent');
    }

    const notification = this.notificationRepository.create({
      sender,
      recipient,
      group,
    });

    return this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipient: { iduser: userId } },
      relations: ['sender', 'group'],
      order: { createdAt: 'DESC' },
    });
  }

  async respondToInvitation(
    notificationId: number,
    userId: number,
    accept: boolean,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, recipient: { iduser: userId } },
      relations: ['group', 'recipient'],
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.status !== NotificationStatus.PENDING) {
      throw new BadRequestException('Invitation already responded to');
    }

    notification.status = accept
      ? NotificationStatus.ACCEPTED
      : NotificationStatus.REJECTED;

    if (accept) {
      // Add user to group
      const group = await this.groupRepository.findOne({
        where: { id: notification.group.id },
        relations: ['members'],
      });

      if (!group.members.some((member) => member.iduser === userId)) {
        group.members.push(notification.recipient);
        await this.groupRepository.save(group);
      }
    }

    return this.notificationRepository.save(notification);
  }
}
