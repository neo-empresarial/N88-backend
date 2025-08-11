import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Users } from 'src/users/user.entity';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() CreateUsersDto: CreateUsersDto) {
    return this.authService.register(CreateUsersDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: Users,
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(user, response, user.iduser);

    return result;
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() user: Users,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const { iduser, name, email } = req.user;
    const result = await this.authService.login(req.user, res);
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS),
    );
    res.cookie('Authentication', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAccessToken,
    });
    res.redirect(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}google-auth-callback?id=${iduser}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async testJwt(@Request() req) {
    return {
      message: 'JWT is working!',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}
