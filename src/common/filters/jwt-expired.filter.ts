import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

@Catch(UnauthorizedException)
export class JwtExpiredFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const cause = (exception as any).cause;

    if (cause instanceof TokenExpiredError) {
      response.status(401).json({
        statusCode: 401,
        message: 'Token expirado',
        error: 'Unauthorized',
      });
    } else {
      response.status(401).json({
        statusCode: 401,
        message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
        error: 'Unauthorized',
      });
    }
  }
}
