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
    console.log('=== JWT Strategy Initialization ===');
    console.log('JWT Secret configured:', !!secret);
    console.log('JWT Secret length:', secret?.length);
    console.log('=== JWT Strategy Initialization End ===');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          try {
            console.log('=== JWT Extraction Start ===');
            console.log(
              'Extracting JWT from request cookies:',
              request.cookies,
            );
            console.log(
              'Extracting JWT from Authorization header:',
              request.headers.authorization,
            );

            // First try to get from cookie
            const tokenFromCookie = request.cookies?.Authentication;
            if (tokenFromCookie) {
              console.log('Found token in cookie');
              return tokenFromCookie;
            }

            // Then try to get from Authorization header
            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
              const token = authHeader.substring(7);
              console.log('Found token in Authorization header');
              console.log('Token:', token);
              console.log('=== JWT Extraction End ===');
              return token;
            }

            console.log('No token found');
            console.log('=== JWT Extraction End ===');
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
      console.log('=== JWT Validation Start ===');
      console.log('Raw payload:', payload);
      console.log('Payload type:', typeof payload);
      console.log('Payload keys:', Object.keys(payload));

      // Handle both userId and userID in the payload
      const userId = payload.userId || payload.userID;
      console.log('Extracted userId:', userId);
      console.log('userId type:', typeof userId);

      if (!userId) {
        console.error('No userId found in payload');
        throw new Error('Invalid token payload: no userId found');
      }

      console.log('Looking up user with ID:', userId);
      const user = await this.usersService.findById(userId);
      console.log('Found user:', user);
      console.log('=== JWT Validation End ===');
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
