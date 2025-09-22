import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SharedSchedulesService } from './shared-schedules.service';
import {
  ShareScheduleDto,
  AcceptSharedScheduleDto,
} from './dto/share-schedule.dto';
import { JwtAuthGuard } from 'src/auth/guards/local-auth.guard';
@Controller('shared-schedules')
@UseGuards(JwtAuthGuard)
export class SharedSchedulesController {
  constructor(
    private readonly sharedSchedulesService: SharedSchedulesService,
  ) {}

  @Post('share')
  async shareSchedule(
    @Request() req,
    @Body() shareScheduleDto: ShareScheduleDto,
  ) {
    return this.sharedSchedulesService.shareSchedule(
      req.userId,
      shareScheduleDto,
    );
  }

  @Get('received')
  async getSharedSchedulesForUser(@Request() req) {
    return this.sharedSchedulesService.getSharedSchedulesForUser(
      req.userId,
    );
  }

  @Get('sent')
  async getSharedSchedulesByUser(@Request() req) {
    return this.sharedSchedulesService.getSharedSchedulesByUser(
      req.userId,
    );
  }

  @Post('accept')
  async acceptSharedSchedule(
    @Request() req,
    @Body() acceptDto: AcceptSharedScheduleDto,
  ) {
    return this.sharedSchedulesService.acceptSharedSchedule(
      req.userId,
      acceptDto,
    );
  }

  @Delete(':id/decline')
  async declineSharedSchedule(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.sharedSchedulesService.declineSharedSchedule(
      req.userId,
      id,
    );
  }
}
