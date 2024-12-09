import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Users } from 'src/users/user.entity';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: Users,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authService.login(user, response);
  }

  @Post('login/google')
  async loginWithGoogle(
    @Body('googleAccessToken') googleAccessToken: string,
    @Res() response: Response,
  ) {
    return this.authService.loginWithGoogle(googleAccessToken, response);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() user: Users,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authService.login(user, response);
  }
}
