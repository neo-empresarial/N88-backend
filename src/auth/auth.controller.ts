import { Body, Controller, Req, Res, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Request as ExRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
      secure: false,
      sameSite: 'strict',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    return { message: 'Tokens atualizados com sucesso' };
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
}
