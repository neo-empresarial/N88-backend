import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleAuthService {
  private oauthClient: OAuth2Client;

  constructor() {
    this.oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(googleAccessToken: string) {
    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: googleAccessToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Google token validation failed');
    }
  }
}
