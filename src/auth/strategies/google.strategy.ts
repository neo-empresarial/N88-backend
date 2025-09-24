import { AuthService } from './../auth.service';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../../config/google-oauth.config';
import { CoursesService } from 'src/courses/courses.service';

@Injectable() 
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
    private readonly coursesService: CoursesService,
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const defaultCourse = await this.coursesService.findByName('N/A');

    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      name: profile.name.givenName,
      provider: 'google',
      // avatarUrl: profile.photos[0].value,
      password: '',
      idcourse: defaultCourse[0].idcourse,
      // refreshToken: '',
      // googleAccessToken: accessToken,
    });
    done(null, { ...user, email: profile.emails[0].value });
  }
}
