import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { config as dotenvConfig } from 'dotenv';
import { GoogleAuthService } from './google-auth.service';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
dotenvConfig({ path: '.env' });

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly configService: ConfigService,
  ) {}

  async register(@Body() registerData: RegisterDto) {
    const user = await this.usersService.findOneByEmail(registerData.email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await hash(registerData.password, 10);

    return this.usersService.create({
      name: registerData.name,
      email: registerData.email,
      provider: 'local',
      password: hashedPassword,
      course: registerData.course,
    });
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const tokens = await this.generateUserTokens(user.iduser);
    return {
      ...tokens,
      userId: user.iduser,
      name: user.name,
      email: user.email,
      provider: user.provider,
      course: user.course,
    };
  }

  async loginGoogle(email: string, res: Response) {
    const user = await this.usersService.findOneByEmail(email);

    const { SignJWT } = await import('jose');

    const tokens = await this.generateUserTokens(user.iduser);

    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const sessionPayload = {
      user: {
        userId: user.iduser,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

    const secretKey = process.env.SESSION_SECRET_KEY!;
    if (!secretKey) {
      throw new Error('SESSION_SECRET_KEY não configurado');
    }
    const encodedKey = new TextEncoder().encode(secretKey);

    const session = new SignJWT(sessionPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiredAt)
      .sign(encodedKey);

    res.cookie('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiredAt,
      path: '/',
    });

    res.cookie('access_token', sessionPayload.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiredAt,
      path: '/',
    });

    res.cookie('refresh_token', sessionPayload.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiredAt,
      path: '/',
    });
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: {
        token: refreshToken,
        expiryDate: MoreThanOrEqual(new Date()),
      },
    });
    if (!token) {
      throw new UnauthorizedException('O Refresh Token é inválido ou expirou');
    }

    return this.generateUserTokens(token.userId);
  }

  private async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign(
      { userId },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: '30s',
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId },
      {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      },
    );

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: number) {
    let refreshToken = await this.refreshTokenRepository.findOne({
      where: { userId: userId },
    });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    if (refreshToken) {
      refreshToken.token = token;
      refreshToken.expiryDate = expiryDate;
    } else {
      refreshToken = this.refreshTokenRepository.create({
        userId: userId,
        token: token,
        expiryDate: expiryDate,
      });
    }

    await this.refreshTokenRepository.save(refreshToken);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (password === '') {
      console.log('Password cannot be empty');
      throw new BadRequestException('Password cannot be empty');
    }

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

  async validateGoogleUser(googleUser: CreateUsersDto) {
    const user = await this.usersService.findOneByEmail(googleUser.email);

    if (user) {
      return { ...user, email: googleUser.email };
    }

    const newUser = await this.usersService.create(googleUser);
    return { ...newUser, email: googleUser.email };
  }
}
