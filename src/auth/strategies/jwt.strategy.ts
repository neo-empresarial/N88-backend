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

    console.log('🔐 [JWT STRATEGY] Initializing with secret:', {
      exists: !!secret,
      length: secret?.length,
      firstChars: secret?.substring(0, 10) + '...',
    });

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          try {
            console.log('🔍 [JWT EXTRACTION] Starting JWT extraction');
            console.log('🔍 [JWT EXTRACTION] Request URL:', request.url);
            console.log(
              '🔍 [JWT EXTRACTION] Cookies:',
              JSON.stringify(request.cookies),
            );
            console.log(
              '🔍 [JWT EXTRACTION] Authorization header:',
              request.headers.authorization,
            );

            const tokenFromCookie = request.cookies?.Authentication;
            if (tokenFromCookie) {
              console.log('🍪 [JWT EXTRACTION] Found token in cookie');
              return tokenFromCookie;
            }

            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
              const token = authHeader.substring(7);
              console.log(
                '🔑 [JWT EXTRACTION] Found Bearer token, length:',
                token.length,
              );
              console.log(
                '🔑 [JWT EXTRACTION] Token preview:',
                token.substring(0, 20) + '...',
              );
              return token;
            }

            console.log('❌ [JWT EXTRACTION] No token found');
            return null;
          } catch (error) {
            console.error('💥 [JWT EXTRACTION] Error extracting JWT:', error);
            return null;
          }
        },
      ]),
      secretOrKey: secret,
      passReqToCallback: true,
    });

    console.log('🔐 [JWT STRATEGY] Strategy configured successfully');
  }

  async validate(payload: TokenPayload) {
    console.log('🔍 [JWT VALIDATION] Starting validation');
    console.log('🔍 [JWT VALIDATION] Payload:', payload);

    try {
      const user = await this.usersService.findById(payload.userId);
      console.log('✅ [JWT VALIDATION] User found:', user ? 'Yes' : 'No');
      console.log('✅ [JWT VALIDATION] User ID:', payload.userId);
      return user;
    } catch (error) {
      console.error('❌ [JWT VALIDATION] Error finding user:', error);
      throw error;
    }
  }
}
