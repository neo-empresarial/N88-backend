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
            return null;
          }
        },
      ]),
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(payload: TokenPayload) {
    this.logger.debug('JWT Payload:', payload);
    return this.usersService.findById(payload.userId);
  }
}
