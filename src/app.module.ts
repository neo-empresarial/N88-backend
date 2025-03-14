import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { SubjectsModule } from './subjects/subjects.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    SubjectsModule,
    UsersModule,
    FeedbackModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

//teste
export class AppModule { }
