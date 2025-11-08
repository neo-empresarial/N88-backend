import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    userId?: string;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) {
      Logger.warn('Authentication token not found in request.');
      throw new UnauthorizedException('Token Inválido!');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.userId = payload.userId;
      Logger.log(`Token válido encontrado. userId: ${payload.userId}`);
    } catch (e) {
      Logger.error(`Erro na verificação do token: ${e.message}`);
      throw new UnauthorizedException('Token Inválido');
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    
    if (request.cookies && request.cookies.access_token) {
      Logger.log('Token extraído do cookie.');
      Logger.log(request.cookies.access_token);
      return request.cookies.access_token;
    }

    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      Logger.log('Token extraído do header Authorization.');
      return token;
    }

    Logger.warn('Nenhum token encontrado no cabeçalho ou cookie.');
    return undefined;
  }
}
