import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { Subjects } from './subjects.entity';
import { CreateSubjectsDto } from './dto/create-subjects.dto';
import { SchedulesService } from './schedules/schedules.service';
import { CreateSchedulesDto } from './schedules/dto/create-schedules.dto';
import { Schedules } from './schedules/schedules.entity';
import { CreateSubjectsSchedulesProfessorsDto } from './dto/create-subjects-schedules-professors.dto';
import { GoogleAuth } from 'google-auth-library';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSubjectsDto } from './dto/update-subjects.dto';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @UseGuards(GoogleAuth) //Não protege nada
  async findAll(): Promise<Subjects[]> {
    return this.subjectsService.findAll();
  }

  @Get('with-relations')
  @UseGuards(GoogleAuth)
  async findAllWithRelations(): Promise<Subjects[]> {
    return this.subjectsService.findAllWithRelations();
  }

  @Get('search')
  @UseGuards(GoogleAuth)
  async findByParameter(@Query() query: any): Promise<Subjects[]> {
    const { name } = query;
    return this.subjectsService.findByParameter(name);
  }

  @Get('by-codes')
  @UseGuards(GoogleAuth)
  async findByCodes(@Query('codes') codes: string) {
    console.log('Received codes:', codes);
    if (!codes) {
      return [];
    }
    const subjectCodes = codes.split(',').filter((code) => code.trim() !== '');
    console.log('Filtered codes:', subjectCodes);
    return this.subjectsService.findByCodes(subjectCodes);
  }

  @Get(':id')
  @UseGuards(GoogleAuth)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Subjects> {
    return this.subjectsService.findOne(id);
  }

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectsDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubjectsDto: UpdateSubjectsDto,
  ) {
    return this.subjectsService.update(+id, updateSubjectsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id);
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
  async findWithSubject(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Schedules[]> {
    return this.schedulesService.findWithSubject(id);
  }

  @Post()
  async create(@Body(ValidationPipe) CreateSchedulesDto: CreateSchedulesDto) {
    return this.schedulesService.create(CreateSchedulesDto);
  }
}
