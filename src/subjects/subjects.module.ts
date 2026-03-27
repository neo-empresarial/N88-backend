import { Module } from '@nestjs/common';
import { SchedulesController, SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subjects } from './subjects.entity';
import { SchedulesService } from './schedules/schedules.service';
import { Schedules } from './schedules/schedules.entity';
import { Professors } from './professors/professors.entity';
import { Classes } from './classes/classes.entity';
import { ClassesService } from './classes/classes.service';
import { SemestersModule } from 'src/semesters/semesters.module';
import { CampusModule } from 'src/campus/campus.module';
import { CompetitionScoreService } from './competition-score.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subjects, Schedules, Professors, Classes]),
    SemestersModule,
    CampusModule,
  ],
  controllers: [SubjectsController, SchedulesController],
  providers: [
    SubjectsService,
    SchedulesService,
    ClassesService,
    CompetitionScoreService,
  ],
})
export class SubjectsModule {}
