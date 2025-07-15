import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    this.logger.debug('JWT Guard - Request URL:', request.url);
    this.logger.debug('JWT Guard - Authorization Header:', authHeader);
    this.logger.debug('JWT Guard - Cookies:', request.cookies);
    return super.canActivate(context);
  }
}
