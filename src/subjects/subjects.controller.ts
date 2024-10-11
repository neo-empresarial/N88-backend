import { Body, Controller, Get, Param, ParseIntPipe, Post, ValidationPipe } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { Subjects } from './subjects.entity';
import { CreateSubjectsDto } from './dto/create-subjects.dto';
import { SchedulesService } from './schedules/schedules.service';
import { CreateSchedulesDto } from './schedules/dto/create-schedules.dto';
import { Schedules } from './schedules/schedules.entity';
import { CreateSubjectsSchedulesProfessorsDto } from './dto/create-subjects-schedules-professors.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async findAll(): Promise<Subjects[]> {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Subjects> {
    return this.subjectsService.findOne(id);
  }

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectsDto){
    return this.subjectsService.create(createSubjectDto);
  }

  // @Post('/all')
  // async createAll(@Body(ValidationPipe) CreateSubjectsSchedulesProfessorsDto: CreateSubjectsSchedulesProfessorsDto){
  //   return this.subjectsService.createAll(CreateSubjectsSchedulesProfessorsDto);
  // }
}

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  async findAll(): Promise<Schedules[]> {
    return this.schedulesService.findAll();
  }

  @Get('subject/:id')
  async findWithSubject(@Param('id', ParseIntPipe) id: number): Promise<Schedules[]> {
    return this.schedulesService.findWithSubject(id);
  }

  @Post()
  async create(@Body(ValidationPipe) CreateSchedulesDto: CreateSchedulesDto){
    return this.schedulesService.create(CreateSchedulesDto);
  }
}
