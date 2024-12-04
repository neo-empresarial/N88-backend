import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Subjects } from 'src/subjects/subjects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Subjects])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
