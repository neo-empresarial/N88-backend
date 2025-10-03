import { Body, Controller, Req, Res, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Request as ExRequest } from 'express';
import { UseGuards, Get } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Req() req, @Body() registerData: RegisterDto) {
    console.log('Register request from IP:', req.ip);

    return {
      statusCode: 201,
      data: await this.authService.register(registerData),
    };
  }

  @Post('login')
  async login(@Req() req, @Body() credentials: LoginDto) {
    return { user: await this.authService.login(credentials) };
  }

  @Post('refresh')
  async refreshTokens(
    @Req() req: ExRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenSend = req.cookies['refresh_token'];

    if (!refreshTokenSend) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(refreshTokenSend);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return { message: 'Tokens atualizados com sucesso' };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    await this.authService.validateGoogleUser(req.user);
    await this.authService.loginGoogle(req.user.email, res);
    res.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}`);
  }
}
