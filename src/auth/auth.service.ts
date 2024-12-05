import { BadRequestException, Injectable, ParseIntPipe, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/user.entity';
import { Response } from 'express';
import { TokenPayload } from './auth-payload.interface';
import { hash } from 'bcryptjs';

import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async login(user: Users, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() + parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS)
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() + parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS)
    );

    const tokenPayload: TokenPayload = {
      userId: user.iduser,
    }

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS}ms`
    })
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS}ms`
    });
    
    await this.usersService.updateUser(user.iduser, {
      refreshToken: await hash(refreshToken, 10)
    })

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // if true in development, it will not work
      expires: expiresAccessToken
    })
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // if true in development, it will not work
      expires: expiresRefreshToken
    })

    return response.json(user);
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const authenticaded = await compare(password, user.password);

    if (!authenticaded) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async verifyUserRefreshToken(refreshToken: string, userId: number){
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
}
