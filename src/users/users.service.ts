import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-users.dto';
import { Subjects } from 'src/subjects/subjects.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Subjects)
    private readonly subjectsRepository: Repository<Subjects>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) { }

  async findAll(): Promise<Users[]> {
    const result = this.usersRepository.find({
      relations: ["subjects"]
    });

    return result;
  }

  async findByCode(code: string): Promise<Users> {
    const result = await this.usersRepository.findOne({
      where: { code: code },
      relations: ["subjects", "subjects.schedules", "subjects.professors"]
    });

    if (!result) {
      throw new NotFoundException(`User with code '${code}' not found`);
    }

    return result;
  }

  async create(CreateUsersDto: CreateUsersDto) {
    const user_with_same_code = await this.usersRepository.findOne({
      where: { code: CreateUsersDto.code }
    });

    if (user_with_same_code) {
      throw new BadRequestException(`User with code ${CreateUsersDto.code} already exists, the code must be unique`);
    }

    const subjects = CreateUsersDto.subjects;

    const subjects_objects = await Promise.all(subjects.map(async (subject) => {
      return this.subjectsRepository.findOne({
        where: { idsubject: subject }
      });
    }))

    const newUsers = new Users();
    newUsers.code = CreateUsersDto.code;
    newUsers.subjects = subjects_objects;

    return this.usersRepository.save(newUsers);
  }

  async deleteOne(id: number) {
    const result = await this.usersRepository.findOne({
      where: { idsavedschedule: id }
    });

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.usersRepository.remove(result);
  }
}
