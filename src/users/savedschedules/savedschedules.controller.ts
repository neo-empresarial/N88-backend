import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SavedSchedulesService } from './savedschedules.service';
import { CreateSavedScheduleDto } from './dto/create-savedschedule.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { SavedSchedules } from './savedschedules.entity';

@Controller('saved-schedules')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SavedSchedulesController {
  constructor(private readonly savedSchedulesService: SavedSchedulesService) {}

  @Post()
  create(
    @Request() req,
    @Body() createSavedScheduleDto: CreateSavedScheduleDto,
  ) {
    return this.savedSchedulesService.create(
      req.user.iduser,
      createSavedScheduleDto,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.savedSchedulesService.findAllByUser(req.user.iduser);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.savedSchedulesService.findOne(+id, req.user.iduser);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSavedScheduleDto: CreateSavedScheduleDto,
  ) {
    return this.savedSchedulesService.update(
      +id,
      req.user.iduser,
      updateSavedScheduleDto,
    );
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.savedSchedulesService.remove(+id, req.user.iduser);
  }
}
