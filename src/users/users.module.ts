import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Subjects } from 'src/subjects/subjects.entity';
import { SavedSchedulesModule } from './savedschedules/savedschedules.module';
import { Courses } from 'src/courses/courses.entity';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Subjects, Courses]), SavedSchedulesModule, CoursesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
