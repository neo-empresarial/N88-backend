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

import { JwtAuthGuard } from 'src/auth/guards/local-auth.guard';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { UpdateSubjectsDto } from './dto/update-subjects.dto';
import { CompetitionScoreService } from './competition-score.service';
import {
  CompetitionScoreDto,
  BatchCompetitionScoreDto,
} from './dto/competition-score.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly competitionScoreService: CompetitionScoreService,
  ) {}

  @Get()
  async findAll(@Query('campus_id') campusId?: string): Promise<Subjects[]> {
    if (campusId) {
      return this.subjectsService.findByCampus(Number(campusId));
    }
    return this.subjectsService.findAll();
  }

  @Get('with-relations')
  async findAllWithRelations(): Promise<Subjects[]> {
    return this.subjectsService.findAllWithRelations();
  }

  @Get('search')
  async findByParameter(@Query() query: any): Promise<Subjects[]> {
    const { name } = query;
    return this.subjectsService.findByParameter(name);
  }

  @Get('competition-scores')
  async getBatchCompetitionScores(
    @Query('codes') codes: string,
  ): Promise<BatchCompetitionScoreDto> {
    if (!codes) {
      return {
        scores: [],
        requestedCodes: [],
        foundCodes: [],
        notFoundCodes: [],
      };
    }
    const codeArray = codes.split(',').filter((code) => code.trim() !== '');
    return this.competitionScoreService.calculateBatchScores(codeArray);
  }

  @Get('by-codes')
  async findByCodes(@Query('codes') codes: string) {
    if (!codes) {
      return [];
    }
    const subjectCodes = codes.split(',').filter((code) => code.trim() !== '');
    return this.subjectsService.findByCodes(subjectCodes);
  }

  @Get(':code/competition-score')
  async getSingleCompetitionScore(
    @Param('code') code: string,
  ): Promise<CompetitionScoreDto> {
    return this.competitionScoreService.calculateAverageScore(code);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Subjects> {
    return this.subjectsService.findOne(id);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  async create(@Body() createSubjectDto: CreateSubjectsDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Patch('by-code/:code')
  @UseGuards(ApiKeyGuard)
  updateByCode(
    @Param('code') code: string,
    @Body() updateSubjectsDto: UpdateSubjectsDto,
  ) {
    return this.subjectsService.updateByCode(code, updateSubjectsDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSubjectsDto: UpdateSubjectsDto,
  ) {
    return this.subjectsService.update(+id, updateSubjectsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id);
  }
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
  @UseGuards(ApiKeyGuard)
  async create(@Body(ValidationPipe) CreateSchedulesDto: CreateSchedulesDto) {
    return this.schedulesService.create(CreateSchedulesDto);
  }
}
