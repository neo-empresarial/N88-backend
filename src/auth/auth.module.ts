import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { GoogleAuthService } from './google-auth.service';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from 'src/config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Courses } from 'src/courses/courses.entity';
import { CoursesModule } from 'src/courses/courses.module';
import { Module, forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    UsersModule,
    forwardRef(() => UsersModule),
    PassportModule,
    forwardRef(() => CoursesModule), 
    CoursesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    }),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleAuthService,
    JwtService,
    GoogleStrategy,
  ],
})
export class AuthModule {}
