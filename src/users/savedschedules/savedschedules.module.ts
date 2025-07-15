import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedSchedules } from './savedschedules.entity';
import { SavedScheduleItems } from './savedscheduleitems.entity';
import { SharedSchedules } from './shared-schedules.entity';
import { SavedSchedulesService } from './savedschedules.service';
import { SavedSchedulesController } from './savedschedules.controller';
import { SharedSchedulesService } from './shared-schedules.service';
import { SharedSchedulesController } from './shared-schedules.controller';
import { Users } from '../user.entity';
import { Group } from '../../groups/groups.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SavedSchedules,
      SavedScheduleItems,
      SharedSchedules,
      Users,
      Group,
    ]),
  ],
  controllers: [SavedSchedulesController, SharedSchedulesController],
  providers: [SavedSchedulesService, SharedSchedulesService],
  exports: [SavedSchedulesService, SharedSchedulesService],
})
export class SavedSchedulesModule {}
