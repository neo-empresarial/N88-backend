import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config as dotenvConfig } from 'dotenv';
import { TokenPayload } from '../auth-payload.interface';
import { UsersService } from 'src/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
dotenvConfig({ path: '.env' });

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly usersService: UsersService) {
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          try {
            this.logger.debug('Extracting JWT from request');
            this.logger.debug('Cookies:', request.cookies);
            this.logger.debug(
              'Authorization header:',
              request.headers.authorization,
            );

            const tokenFromCookie = request.cookies?.Authentication;
            if (tokenFromCookie) {
              this.logger.debug('Found token in cookie');
              return tokenFromCookie;
            }

            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
              const token = authHeader.substring(7);
              this.logger.debug('Found Bearer token');
              return token;
            }

            this.logger.debug('No token found');
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

    this.logger.debug('JWT Strategy - Secret exists:', !!secret);
    this.logger.debug('JWT Strategy - Secret length:', secret?.length);
  }

  async validate(payload: TokenPayload) {
    this.logger.debug('JWT Payload:', payload);
    return this.usersService.findById(payload.userId);
  }
}
