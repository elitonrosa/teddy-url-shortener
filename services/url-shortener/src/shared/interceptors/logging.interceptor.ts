import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const responseTime = Date.now() - now;

          this.logger.log({
            message: `${method} ${url}`,
            method,
            url,
            statusCode: response.statusCode,
            responseTime,
            body,
          });
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error({
            message: `${method} ${url}`,
            method,
            url,
            statusCode: error.status,
            responseTime,
            body,
            trace: error.stack,
          });
        },
      }),
    );
  }
}
