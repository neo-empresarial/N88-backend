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
import { JwtAuthGuard } from 'src/auth/guards/local-auth.guard';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

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
      req.userId,
      createSavedScheduleDto,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.savedSchedulesService.findAllByUser(req.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.savedSchedulesService.findOne(+id, req.userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSavedScheduleDto: CreateSavedScheduleDto,
  ) {
    return this.savedSchedulesService.update(
      +id,
      req.userId,
      updateSavedScheduleDto,
    );
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.savedSchedulesService.remove(+id, req.userId);
  }
}
