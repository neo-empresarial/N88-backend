import {
  Body,
  Controller,
  Get,
  Req,
  Res,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-tokens.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from "../decorators/public.decorator";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  async register(@Req() req, @Body() registerData: RegisterDto) {
    // Exemplo de uso: logar o IP do cliente
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
  async refreshTokens(@Req() req, @Body() refreshTokenDto: RefreshTokenDto) {
    // Exemplo de uso: logar a URL completa
    console.log('Refresh token request to:', req.originalUrl);

    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  // @UseGuards(GoogleAuthGuard)
  // @Get('google/login')
  // googleLogin() {}

  // @UseGuards(GoogleAuthGuard)
  // @Get('google/callback')
  // async googleCallback(@Req() req, @Res() res) {
  //   const { iduser, name, email } = req.user;
  //   const result = await this.authService.login(req.user);
  //   const expiresAccessToken = new Date();
  //   expiresAccessToken.setMilliseconds(
  //     expiresAccessToken.getTime() +
  //       parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS),
  //   );
  //   res.cookie('Authentication', result.accessToken, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //     expires: expiresAccessToken,
  //   });
  //   res.redirect(
  //     `${process.env.NEXT_PUBLIC_FRONTEND_URL}google-auth-callback?id=${iduser}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`,
  //   );
  // }

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