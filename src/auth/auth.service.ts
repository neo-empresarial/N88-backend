import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/user.entity';
import { Response } from 'express';
import { TokenPayload } from './auth-payload.interface';
import { hash } from 'bcryptjs';

import { config as dotenvConfig } from 'dotenv';
import { GoogleAuthService } from './google-auth.service';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';
dotenvConfig({ path: '.env' });

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  private async generateAndSetTokens(user: Users, response: Response) {
    const expiresAccessToken = new Date();
    const expirationMs = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS);
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getMilliseconds() + expirationMs,
    );

    const tokenPayload: TokenPayload = { userId: user.iduser };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: '7d', // 7 days instead of short expiration
    });

    await this.usersService.updateUser(user.iduser, {
      refreshToken: await hash(refreshToken, 10),
    });

    // Return tokens in response body for Bearer token authentication
    return { user, accessToken, refreshToken };
  }

  // Normal Login functions
  async login(user: Users, response: Response, userId?: number) {
    const profile = await this.usersService.findById(userId);

    const { accessToken, refreshToken } = await this.generateAndSetTokens(
      profile,
      response,
    );

    const responseData = {
      user: {
        id: profile.iduser,
        name: profile.name,
        email: profile.email,
      },
      accessToken,
      refreshToken,
    };

    return responseData;
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      console.log('User not found');
      throw new BadRequestException('User not found');
    }

    const authenticated = await compare(password, user.password);
    console.log('Password authentication result:', authenticated);

    if (!authenticated) {
      console.log('Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    const response = {
      iduser: user.iduser,
      name: user.name,
      email: user.email,
    };

    return response;
  }

  // Google Login functions
  // async loginWithGoogle(googleAccessToken: string, response: Response) {
  //   const user = await this.usersService.findOrCreateGoogleUser(
  //     await this.googleAuthService.verifyGoogleToken(googleAccessToken),
  //   );

  //   await this.usersService.updateUser(user.iduser, { googleAccessToken });
  //   return this.generateAndSetTokens(user, response);
  // }

  // async verifyGoogleUser(googleAccessToken: string) {
  //   const googlePayload = await this.googleAuthService.verifyGoogleToken(googleAccessToken);

  //   return this.usersService.findOneByEmail(googlePayload.email);
  // }

  async verifyUserRefreshToken(refreshToken: string, userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const authenticaded = await compare(refreshToken, user.refreshToken);

    if (!authenticaded) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }

  async register(createUsersDto: CreateUsersDto) {
    const user = await this.usersService.findOneByEmail(createUsersDto.email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    return this.usersService.create(createUsersDto);
  }

  async validateGoogleUser(googleUser: CreateUsersDto) {
    const user = await this.usersService.findOneByEmail(googleUser.email);

    if (user) {
      return { ...user, email: googleUser.email };
    }

    const newUser = await this.usersService.create(googleUser);
    return { ...newUser, email: googleUser.email };
  }
}
