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

    async findAll(): Promise<ICourse[]> {
        const courses = await this.coursesRepository.find();
        return courses;
    }

    async findOne(id: number): Promise<ICourse> {
        const course = await this.coursesRepository.findOne({
            where: { idcourse: id },
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found.`);
        }

        return course;
    }

    async findByName(name: string): Promise<ICourse[]> {
        return this.coursesRepository.find({
            where: {
                course: Like(`%${name}%`),
            },
        });
    }
}