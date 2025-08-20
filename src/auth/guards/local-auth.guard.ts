import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

// Extending the Request interface to include userId
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
    const token = this.extractToken(request); // Chamando o novo método
    if (!token) {
      // O token não foi encontrado, então o usuário não está autorizado
      Logger.warn('Authentication token not found in request.');
      throw new UnauthorizedException('Token Inválido!');
    }

    try {
      // Tenta verificar o token
      const payload = this.jwtService.verify(token);
      request.userId = payload.userId;
      Logger.log(`Token válido encontrado. userId: ${payload.userId}`);
    } catch (e) {
      // A verificação do token falhou (expirado, inválido, etc.)
      Logger.error(`Erro na verificação do token: ${e.message}`);
      throw new UnauthorizedException('Token Inválido');
    }
    return true;
  }

  // Método para extrair o token do cabeçalho ou do cookie
  private extractToken(request: Request): string | undefined {
    // 1. Tenta extrair o token do cabeçalho de Autorização (Bearer)
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      Logger.log('Token extraído do cabeçalho de Autorização.');
      return token;
    }

    // 2. Se não encontrar no cabeçalho, tenta extrair do cookie
    if (request.cookies && request.cookies.access_token) {
      Logger.log('Token extraído do cookie.');
      Logger.log(request.cookies.access_token);
      return request.cookies.access_token;
    }

    Logger.warn('Nenhum token encontrado no cabeçalho ou cookie.');
    return undefined;
  }
}