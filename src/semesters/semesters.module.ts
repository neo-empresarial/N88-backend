import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semesters } from './semesters.entity';
import { SemestersService } from './semesters.service';
import { SemestersController } from './semesters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Semesters])],
  providers: [SemestersService],
  controllers: [SemestersController],
  exports: [SemestersService],
})
export class SemestersModule {}
