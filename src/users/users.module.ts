import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Subjects } from 'src/subjects/subjects.entity';
import { SavedSchedulesModule } from './savedschedules/savedschedules.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Subjects]), SavedSchedulesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
