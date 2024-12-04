import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { config as dotenvConfig } from 'dotenv';
import { TokenPayload } from "../auth-payload.interface";
import { UsersService } from "src/users/users.service";
dotenvConfig({ path: '.env' });

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.Authentication
      ]),
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET
    });
  }

  async validate(payload: TokenPayload){
    return this.usersService.findById(payload.userId);
  }
}