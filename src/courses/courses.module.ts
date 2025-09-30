import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Courses } from './courses.entity';

const TypeOrmForCourses = TypeOrmModule.forFeature([Courses]);

@Module({
  imports: [TypeOrmForCourses],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService, TypeOrmForCourses,]
})
export class CoursesModule {}
