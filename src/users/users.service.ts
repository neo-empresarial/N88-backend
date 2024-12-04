import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-users.dto';

import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) { }

  async findAll(): Promise<Users[]> {
    const result = this.usersRepository.find({
      relations: ["subjects"]
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
      relations: ["subjects", "subjects.schedules", "subjects.professors"]
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

}
