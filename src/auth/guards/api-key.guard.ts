import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'] as string | undefined;

    const expectedKey = process.env.SCRAPER_API_KEY;

    if (!expectedKey) {
      throw new UnauthorizedException(
        'SCRAPER_API_KEY not configured on server',
      );
    }

    if (!apiKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
