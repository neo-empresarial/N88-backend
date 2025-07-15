import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    console.log('🛡️ [JWT GUARD] Request URL:', request.url);
    console.log('🛡️ [JWT GUARD] Authorization Header:', authHeader);
    console.log('🛡️ [JWT GUARD] Cookies:', JSON.stringify(request.cookies));
    console.log('🛡️ [JWT GUARD] All headers:', JSON.stringify(request.headers));

    const result = super.canActivate(context);
    console.log('🛡️ [JWT GUARD] Can activate result:', result);
    return result;
  }
}
