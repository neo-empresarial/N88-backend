import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config as dotenvConfig } from 'dotenv';
import { TokenPayload } from '../auth-payload.interface';
import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';
dotenvConfig({ path: '.env' });

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET;


    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          try {

            const tokenFromCookie = request.cookies?.Authentication;
            if (tokenFromCookie) {
              return tokenFromCookie;
            }

            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
              const token = authHeader.substring(7);

              return token;
            }

            return null;
          } catch (error) {
            console.error('Error extracting JWT:', error);
            return null;
          }
        },
      ]),
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    try {

      // Handle both userId and userID in the payload
      const userId = payload.userId || payload.userID;


      if (!userId) {
        console.error('No userId found in payload');
        throw new Error('Invalid token payload: no userId found');
      }

      const user = await this.usersService.findById(userId);

      return user;
    } catch (error) {
      console.error('Error in JWT validation:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
