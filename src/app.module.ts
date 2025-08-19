import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { SubjectsModule } from './subjects/subjects.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { GroupsModule } from './groups/groups.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RefreshToken } from './auth/entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    SubjectsModule,
    UsersModule,
    FeedbackModule,
    AuthModule,
    GroupsModule,
    NotificationsModule,
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  controllers: [AppController],
  providers: [AppService],
})

//teste
export class AppModule {}
