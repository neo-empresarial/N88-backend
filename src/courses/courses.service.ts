import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Courses } from './courses.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Courses)
        private readonly coursesRepository: Repository<Courses>,
    ) {}

    async findAll(): Promise<Courses[]> {
        return this.coursesRepository.find();
    }

    async findOne(id: number): Promise<Courses> {
        const course = await this.coursesRepository.findOne({
            where: { idcourse: id },
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
        });
    }
}