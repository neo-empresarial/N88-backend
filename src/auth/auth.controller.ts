import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-tokens.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    return {
      statusCode: 201,
      data: await this.authService.register(registerData),
    };
  }

  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return { statusCode: 201, user: await this.authService.login(credentials) };
  }

  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
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
