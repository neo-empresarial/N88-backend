import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from './dto/friends.entity';
import { Users } from '../user.entity';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { UsersModule } from '../users.module';
import { NotificationsModule } from '../../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friends, Users]),
    forwardRef(() => UsersModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
