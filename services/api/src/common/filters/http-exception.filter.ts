import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'SERVER_INTERNAL';
    let message = 'Lỗi hệ thống, vui lòng thử lại sau';
    let details: Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();

      if (typeof exResponse === 'object' && exResponse !== null) {
        const resp = exResponse as Record<string, unknown>;
        errorCode = (resp.errorCode as string) || this.statusToCode(status);
        message = (resp.message as string) || exception.message;
        details = (resp.details as Record<string, unknown>) || {};
      } else {
        message = exception.message;
        errorCode = this.statusToCode(status);
      }
    }

    // Logging
    const reqMethod = request.method;
    const reqUrl = request.originalUrl || request.url;
    const reqQuery = Object.keys(request.query || {}).length ? `\n    Query: ${JSON.stringify(request.query)}` : '';
    const reqBody = Object.keys(request.body || {}).length ? `\n    Body: ${JSON.stringify(request.body)}` : '';
    const reqLog = `\n    Route: ${reqMethod} ${reqUrl}${reqQuery}${reqBody}`;

    if (status >= 500) {
      this.logger.error(
        `${status} ${errorCode}: ${message}${reqLog}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else if (status >= 400) {
      this.logger.warn(`${status} ${errorCode}: ${message}${reqLog}`);
    }

    response.status(status).json({
      data: null,
      meta: null,
      error: {
        code: errorCode,
        message,
        details,
      },
    });
  }

  private statusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'VALIDATION_ERROR',
      401: 'AUTH_TOKEN_INVALID',
      403: 'RESOURCE_FORBIDDEN',
      404: 'RESOURCE_NOT_FOUND',
      409: 'RESOURCE_CONFLICT',
      429: 'RATE_API_LIMIT',
      500: 'SERVER_INTERNAL',
      503: 'SERVER_RECOMMENDATION_UNAVAILABLE',
      504: 'SERVER_SERVICE_TIMEOUT',
    };
    return map[status] || 'SERVER_INTERNAL';
  }
}
