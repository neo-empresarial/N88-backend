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
  ) { }

  async findAll(): Promise<Users[]> {
    const result = this.usersRepository.find({
      relations: ["savedschedules"]
    });

    return result;
  }

  async findOneByEmail(email: string): Promise<Users> {
    const result = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (!result) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    return result;
  }

  async findById(id: number): Promise<Users> {
    const result = await this.usersRepository.findOne({
      where: { iduser: id },
      relations: ["savedschedules"]
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

    const hash_password = await hash(CreateUsersDto.password, 10);

    newUsers.password = hash_password;
    newUsers.course = CreateUsersDto.course;

    return this.usersRepository.save(newUsers);
  }

  async deleteOne(id: number) {
    const result = await this.usersRepository.findOne({
      where: { iduser: id }
    });

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.usersRepository.remove(result);
  }

  async updateUser(id: number, updateUserDto: UpdateUsersDto): Promise<Users>{
    let user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    user = {...user, ...updateUserDto};

    return this.usersRepository.save(user);
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
    newUser.course = "N/A";
    newUser.googleAccessToken = googlePayload.access_token;
    newUser.authType = 'google';

    return this.usersRepository.save(newUser);
  }

  async checkExtraInfo(id: number){
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (user.course == "N/A") {
      throw new NotFoundException(`User with id ${id} has no course information`);
    }

    return user;
  }

}
