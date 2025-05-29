// src/groups/groups.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './groups.entity';
import { Users } from '../users/user.entity';
import { CreateGroupDto } from './dtos/create-group.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async create(
    createGroupDto: CreateGroupDto,
    ownerId: string,
  ): Promise<Group> {
    const owner = await this.userRepository.findOne({
      where: { iduser: Number(ownerId) },
    });
    if (!owner) {
      throw new NotFoundException('User not found');
    }

    // Get all members including the owner
    const memberIds = [Number(ownerId), ...createGroupDto.members];
    const members = await this.userRepository.findByIds(memberIds);

    if (members.length !== memberIds.length) {
      throw new NotFoundException('One or more users not found');
    }

    const group = this.groupRepository.create({
      name: createGroupDto.name,
      description: createGroupDto.description,
      createdBy: Number(ownerId),
      members: members,
    });

    return this.groupRepository.save(group);
  }

  async findAll(userId: string): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.owner', 'owner')
      .leftJoinAndSelect('group.members', 'members')
      .where('members.id = :userId', { userId })
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<Group> {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.owner', 'owner')
      .leftJoinAndSelect('group.members', 'members')
      .where('group.id = :id', { id })
      .andWhere('members.id = :userId', { userId })
      .getOne();

    if (!group) {
      throw new NotFoundException('Group not found or you are not a member');
    }

    return group;
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
    userId: string,
  ): Promise<Group> {
    const group = await this.findOne(id, userId);

    if (group.createdBy !== Number(userId)) {
      throw new ForbiddenException('Only the group owner can update the group');
    }

    Object.assign(group, updateGroupDto);
    return this.groupRepository.save(group);
  }

  async addMember(
    groupId: string,
    userIdToAdd: string,
    requesterId: string,
  ): Promise<Group> {
    const group = await this.findOne(groupId, requesterId);

    if (group.createdBy !== Number(requesterId)) {
      throw new ForbiddenException('Only the group owner can add members');
    }

    const userToAdd = await this.userRepository.findOne({
      where: { iduser: Number(userIdToAdd) },
    });
    if (!userToAdd) {
      throw new NotFoundException('User to add not found');
    }

    const isAlreadyMember = group.members.some(
      (member) => member.iduser === Number(userIdToAdd),
    );
    if (isAlreadyMember) {
      throw new BadRequestException('User is already a member of this group');
    }

    group.members.push(userToAdd);
    return this.groupRepository.save(group);
  }

  async removeMember(
    groupId: string,
    userIdToRemove: string,
    requesterId: string,
  ): Promise<Group> {
    const group = await this.findOne(groupId, requesterId);

    if (
      group.createdBy !== Number(requesterId) &&
      userIdToRemove !== requesterId
    ) {
      throw new ForbiddenException(
        'Only the group owner can remove other members, or you can remove yourself',
      );
    }

    if (Number(userIdToRemove) === group.createdBy) {
      throw new BadRequestException('Group owner cannot be removed');
    }

    group.members = group.members.filter(
      (member) => member.iduser !== Number(userIdToRemove),
    );
    return this.groupRepository.save(group);
  }

  async remove(id: string, userId: string): Promise<void> {
    const group = await this.findOne(id, userId);

    if (group.createdBy !== Number(userId)) {
      throw new ForbiddenException('Only the group owner can delete the group');
    }

    await this.groupRepository.remove(group);
  }

  async searchUsers(query: string, currentUserId: string): Promise<Users[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :currentUserId', { currentUserId })
      .andWhere('(user.name ILIKE :query OR user.email ILIKE :query)', {
        query: `%${query}%`,
      })
      .take(10)
      .getMany();
  }
}
