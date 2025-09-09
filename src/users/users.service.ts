import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-users.dto';

import { hash } from 'bcryptjs';
import { UpdateUsersDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
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
      select: [
        'iduser',
        'name',
        'email',
        'password',
        'course',
        'authType',
        'refreshToken',
        'googleAccessToken',
      ],
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

    if (CreateUsersDto.password) {
      newUsers.password = await hash(CreateUsersDto.password, 10);
    }

    newUsers.course = CreateUsersDto.course;

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
    console.log('Service - Finding user with ID:', id);
    let user = await this.findById(id);
    console.log('Service - Found user before update:', user.name, user.email);
  
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    console.log('Service - Update data received:', updateUserDto);
    user = { ...user, ...updateUserDto };
    console.log('Service - User after merge:', user.name, user.email);
    const savedUser = await this.usersRepository.save(user);
    console.log('Service - User after save:', savedUser.name, savedUser.email);
    const verifyUser = await this.usersRepository.findOne({ where: { iduser: id } });
    console.log('Service - Verification query result:', verifyUser?.name, verifyUser?.email);
    return savedUser;
  }

  async findOrCreateGoogleUser(googlePayload: any) {
    const user = await this.usersRepository.findOne({
      where: { email: googlePayload.email },
    });

    if (user) {
      return user;
    }

    const newUser = new Users();
    newUser.name = googlePayload.name;
    newUser.email = googlePayload.email;
    newUser.course = 'N/A';
    newUser.googleAccessToken = googlePayload.access_token;
    newUser.authType = 'google';

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
}
