import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './notifications.entity';
import { Users } from '../users/user.entity';
import { Group } from '../groups/groups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Users, Group])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
