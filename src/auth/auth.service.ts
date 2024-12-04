import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/user.entity';
import { Response } from 'express';
import { TokenPayload } from './auth-payload.interface';

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

    const tokenPayload: TokenPayload = {
      userId: user.iduser,
    }

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS}ms`
    })

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // if true in development, it will not work
      expires: expiresAccessToken
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
}
