import { Module } from '@nestjs/common';
import { SchedulesController, SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subjects } from './subjects.entity';
import { SchedulesService } from './schedules.service';
import { Schedules } from './schedules.entity';
import { Professors } from './professors.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subjects, Schedules, Professors])],
  controllers: [SubjectsController, SchedulesController],
  providers: [SubjectsService, SchedulesService]
})
export class SubjectsModule {}
