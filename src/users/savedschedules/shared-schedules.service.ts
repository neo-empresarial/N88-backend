import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedSchedules } from './shared-schedules.entity';
import { SavedSchedules } from './savedschedules.entity';
import { SavedScheduleItems } from './savedscheduleitems.entity';
import { Users } from '../user.entity';
import { Group } from '../../groups/groups.entity';
import {
  ShareScheduleDto,
  AcceptSharedScheduleDto,
  SharedScheduleResponseDto,
} from './dto/share-schedule.dto';

@Injectable()
export class SharedSchedulesService {
  constructor(
    @InjectRepository(SharedSchedules)
    private readonly sharedSchedulesRepository: Repository<SharedSchedules>,
    @InjectRepository(SavedSchedules)
    private readonly savedSchedulesRepository: Repository<SavedSchedules>,
    @InjectRepository(SavedScheduleItems)
    private readonly savedScheduleItemsRepository: Repository<SavedScheduleItems>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
  ) {}

  async shareSchedule(
    userId: number,
    shareScheduleDto: ShareScheduleDto,
  ): Promise<SharedSchedules[]> {
    // Verify the schedule belongs to the user
    const schedule = await this.savedSchedulesRepository.findOne({
      where: {
        idsavedschedule: shareScheduleDto.scheduleId,
        user: { iduser: userId },
      },
    });

    if (!schedule) {
      throw new NotFoundException(
        'Schedule not found or you do not have permission to share it',
      );
    }

    // Verify the group exists and user is a member
    const group = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoin('group.members', 'members')
      .where('group.id = :groupId', { groupId: shareScheduleDto.groupId })
      .andWhere('members.iduser = :userId', { userId })
      .getOne();

    if (!group) {
      throw new NotFoundException('Group not found or you are not a member');
    }

    // Get all members of the group except the current user
    const groupMembers = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'members')
      .where('group.id = :groupId', { groupId: shareScheduleDto.groupId })
      .getOne();

    if (!groupMembers) {
      throw new NotFoundException('Group not found');
    }

    const targetUsers = shareScheduleDto.userIds
      ? groupMembers.members.filter(
          (member) =>
            shareScheduleDto.userIds!.includes(member.iduser) &&
            member.iduser !== userId,
        )
      : groupMembers.members.filter((member) => member.iduser !== userId);

    if (targetUsers.length === 0) {
      throw new BadRequestException('Sem usuários válidos para compartilhar');
    }

    // Create shared schedule records
    const sharedSchedules: SharedSchedules[] = [];

    for (const targetUser of targetUsers) {
      // Check if already shared
      const existingShare = await this.sharedSchedulesRepository.findOne({
        where: {
          scheduleId: shareScheduleDto.scheduleId,
          sharedByUserId: userId,
          sharedWithUserId: targetUser.iduser,
          groupId: shareScheduleDto.groupId,
        },
      });

      if (existingShare) {
        continue; // Skip if already shared
      }

      const sharedSchedule = this.sharedSchedulesRepository.create({
        scheduleId: shareScheduleDto.scheduleId,
        sharedByUserId: userId,
        sharedWithUserId: targetUser.iduser,
        groupId: shareScheduleDto.groupId,
        isAccepted: false,
      });

      sharedSchedules.push(
        await this.sharedSchedulesRepository.save(sharedSchedule),
      );
    }

    return sharedSchedules;
  }

  async getSharedSchedulesForUser(
    userId: number,
  ): Promise<SharedScheduleResponseDto[]> {
    const sharedSchedules = await this.sharedSchedulesRepository.find({
      where: { sharedWithUserId: userId },
      relations: [
        'originalSchedule',
        'originalSchedule.items',
        'sharedByUser',
        'group',
      ],
    });

    return sharedSchedules.map((shared) => ({
      id: shared.id,
      scheduleId: shared.scheduleId,
      sharedByUserId: shared.sharedByUserId,
      sharedByUserName: shared.sharedByUser?.name || 'Unknown User',
      sharedWithUserId: shared.sharedWithUserId,
      groupId: shared.groupId,
      groupName: shared.group?.name || 'Unknown Group',
      sharedAt: shared.sharedAt,
      isAccepted: shared.isAccepted,
      acceptedAt: shared.acceptedAt,
      originalSchedule: {
        title: shared.originalSchedule?.title || 'Untitled Schedule',
        description: shared.originalSchedule?.description || '',
        items:
          shared.originalSchedule?.items?.map((item) => ({
            subjectCode: item.subjectCode,
            classCode: item.classCode,
            activated: item.activated,
          })) || [],
      },
    }));
  }

  async acceptSharedSchedule(
    userId: number,
    acceptDto: AcceptSharedScheduleDto,
  ): Promise<SavedSchedules> {
    const sharedSchedule = await this.sharedSchedulesRepository.findOne({
      where: {
        id: acceptDto.sharedScheduleId,
        sharedWithUserId: userId,
        isAccepted: false,
      },
      relations: ['originalSchedule', 'originalSchedule.items'],
    });

    if (!sharedSchedule) {
      throw new NotFoundException(
        'Shared schedule not found or already accepted',
      );
    }

    // Mark as accepted
    sharedSchedule.isAccepted = true;
    sharedSchedule.acceptedAt = new Date();
    await this.sharedSchedulesRepository.save(sharedSchedule);

    // Create a copy of the schedule for the user
    const newSchedule = this.savedSchedulesRepository.create({
      title: `${sharedSchedule.originalSchedule.title} (Shared)`,
      description: sharedSchedule.originalSchedule.description,
      user: { iduser: userId } as any,
    });

    const savedNewSchedule =
      await this.savedSchedulesRepository.save(newSchedule);

    // Copy the schedule items
    const scheduleItems = sharedSchedule.originalSchedule.items.map((item) => {
      const newItem = this.savedScheduleItemsRepository.create({
        subjectCode: item.subjectCode,
        classCode: item.classCode,
        activated: item.activated,
        savedSchedule: savedNewSchedule,
      });
      return newItem;
    });

    await this.savedScheduleItemsRepository.save(scheduleItems);

    return savedNewSchedule;
  }

  async declineSharedSchedule(
    userId: number,
    sharedScheduleId: number,
  ): Promise<void> {
    const sharedSchedule = await this.sharedSchedulesRepository.findOne({
      where: {
        id: sharedScheduleId,
        sharedWithUserId: userId,
        isAccepted: false,
      },
    });

    if (!sharedSchedule) {
      throw new NotFoundException(
        'Shared schedule not found or already processed',
      );
    }

    await this.sharedSchedulesRepository.remove(sharedSchedule);
  }

  async getSharedSchedulesByUser(
    userId: number,
  ): Promise<SharedScheduleResponseDto[]> {
    const sharedSchedules = await this.sharedSchedulesRepository.find({
      where: { sharedByUserId: userId },
      relations: [
        'originalSchedule',
        'originalSchedule.items',
        'sharedByUser',
        'sharedWithUser',
        'group',
      ],
    });

    return sharedSchedules.map((shared) => ({
      id: shared.id,
      scheduleId: shared.scheduleId,
      sharedByUserId: shared.sharedByUserId,
      sharedByUserName: shared.sharedByUser?.name || 'Unknown User',
      sharedWithUserId: shared.sharedWithUserId,
      groupId: shared.groupId,
      groupName: shared.group?.name || 'Unknown Group',
      sharedAt: shared.sharedAt,
      isAccepted: shared.isAccepted,
      acceptedAt: shared.acceptedAt,
      originalSchedule: {
        title: shared.originalSchedule?.title || 'Untitled Schedule',
        description: shared.originalSchedule?.description || '',
        items:
          shared.originalSchedule?.items?.map((item) => ({
            subjectCode: item.subjectCode,
            classCode: item.classCode,
            activated: item.activated,
          })) || [],
      },
    }));
  }
}
