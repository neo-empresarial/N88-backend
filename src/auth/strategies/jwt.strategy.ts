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
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    this.logger.debug('JWT Payload:', payload);
    return payload;
  }
}
