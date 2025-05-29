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
    console.log('=== Login Controller Start ===');
    console.log('Current user from decorator:', user);
    console.log('User from request:', req.user);

    console.log('User ID from controller:', user.iduser);
    const result = await this.authService.login(user, response, user.iduser);
    console.log('Login result from service:', result);

    console.log('Returning user data:', result);
    console.log('=== Login Controller End ===');
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

  // @Post('login/google')
  // @UseGuards(GoogleAuthGuard)
  // async loginWithGoogle(
  //   @Body('googleAccessToken') googleAccessToken: string,
  //   @Res() response: Response,
  // ) {
  //   return this.authService.loginWithGoogle(googleAccessToken, response);
  // }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle() {}

  // @Get('google/callback')
  // @UseGuards(GoogleAuthGuard)
  // async googleCallback(
  //   @CurrentUser() user: Users,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   await this.authService.login(user, response);
  // }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const { iduser, name, email } = req.user;
    console.log('Google user data:', req.user);
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
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}google-auth-callback?id=${iduser}&name=${name}&email=${email}`,
    );
  }
}
