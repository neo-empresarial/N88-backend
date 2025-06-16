import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedSchedules } from './savedschedules.entity';
import { SavedScheduleItems } from './savedscheduleitems.entity';
import { SavedSchedulesService } from './savedschedules.service';
import { SavedSchedulesController } from './savedschedules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SavedSchedules, SavedScheduleItems])],
  controllers: [SavedSchedulesController],
  providers: [SavedSchedulesService],
  exports: [SavedSchedulesService],
})
export class SavedSchedulesModule {}
