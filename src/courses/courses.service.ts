import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Courses } from './courses.entity';
import { ICourse } from './course.interface';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
  ) {}

  async findOneByCourseName(courseName: string): Promise<Courses | null> {
    return this.coursesRepository.findOne({
      where: { course: courseName },
    });
  }

  async findAll(): Promise<Courses[]> {
    const courses = await this.coursesRepository.find({
      relations: ['campus'],
    });
    return courses;
  }

  async findOne(id: number): Promise<Courses> {
    const course = await this.coursesRepository.findOne({
      where: { idcourse: id },
      relations: ['campus'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }

    return course;
  }

  async findByName(name: string): Promise<Courses[]> {
    return this.coursesRepository.find({
      where: {
        course: Like(`%${name}%`),
      },
      relations: ['campus'],
    });
  }
}
