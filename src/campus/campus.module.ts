import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campus } from './campus.entity';
import { CampusService } from './campus.service';
import { CampusController } from './campus.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Campus])],
  controllers: [CampusController],
  providers: [CampusService],
  exports: [CampusService],
})
export class CampusModule {}
