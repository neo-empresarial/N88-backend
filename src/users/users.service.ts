import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType, NotificationStatus } from 'src/notifications/notifications.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(): Promise<Users[]> {
    const result = this.usersRepository.find({
      relations: ['savedschedules'],
    });

    return result;
  }

  async findOneByEmail(email: string): Promise<Users> {
    const result = await this.usersRepository.findOne({
      where: { email: email },
      select: ['iduser', 'name', 'email', 'password', 'provider', 'course'],
    });
    return result;
  }

  async findById(id: number): Promise<Users> {
    const result = await this.usersRepository.findOne({
      where: { iduser: id },
      relations: ['savedschedules'],
    });

    if (!result) {
      throw new NotFoundException(`User with code '${id}' not found`);
    }

    return result;
  }

  async create(CreateUsersDto: CreateUsersDto) {
    const newUsers = new Users();
    newUsers.name = CreateUsersDto.name;
    newUsers.email = CreateUsersDto.email;
    newUsers.provider = CreateUsersDto.provider;

    if (CreateUsersDto.password) {
      newUsers.password = CreateUsersDto.password;
    }

    newUsers.idcourse = CreateUsersDto.idcourse;

    return this.usersRepository.save(newUsers);
  }

  async deleteOne(id: number) {
    const result = await this.usersRepository.findOne({
      where: { iduser: id },
    });

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.usersRepository.remove(result);
  }

  async updateUser(id: number, updateUserDto: UpdateUsersDto): Promise<Users> {
    let user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const wasCourseEmpty = user.course === 'N/A' || !user.course;
    const isNowFilled = updateUserDto.course && updateUserDto.course !== 'N/A';

    if (wasCourseEmpty && isNowFilled) {
      const notifications = await this.notificationsService.getUserNotifications(id);
      const profileNotification = notifications.find(
        (n) => n.type === NotificationType.PROFILE_COMPLETION && n.status === NotificationStatus.PENDING
      );
      
      if (profileNotification) {
        await this.notificationsService.respondToInvitation(profileNotification.id, id, true);
      }
    }

    user = { ...user, ...updateUserDto };
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async findOrCreateGoogleUser(googlePayload: any) {
    let user = await this.usersRepository.findOne({
      where: { email: googlePayload.email },
    });

    if (user) {
      if (googlePayload.profilePicture && user.profilePicture !== googlePayload.profilePicture) {
        user.profilePicture = googlePayload.profilePicture;
        await this.usersRepository.save(user);
      }
      return user;
    }

    const newUser = new Users();
    newUser.name = googlePayload.name;
    newUser.email = googlePayload.email;
    newUser.course = 'N/A';
    newUser.provider = 'google';
    newUser.password = '';
    newUser.profilePicture = googlePayload.profilePicture || null;

    return this.usersRepository.save(newUser);
  }

  async checkExtraInfo(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (user.course == 'N/A') {
      throw new NotFoundException(
        `User with email ${email} has no course information`,
      );
    }

    return user;
  }

  async searchUsers(query: string, currentUserId: number): Promise<Users[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.iduser != :currentUserId', { currentUserId })
      .andWhere('(user.name ILIKE :query OR user.email ILIKE :query)', {
        query: `%${query}%`,
      })
      .take(10)
      .getMany();
  }
}
