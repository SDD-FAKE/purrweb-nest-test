import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const {method, originalUrl, ip, headers} = request;
        const userAgent = headers['user-agent'] || '';

        const startTime = Date.now();

        return next.handle().pipe(
            tap((data) => {
                const responseTime = Date.now() - startTime;
                const logMessage = `${method} ${originalUrl} - ${responseTime}ms - IP: ${ip} - UserAgent: ${userAgent}`;

                this.logger.log(logMessage, 'ACCESS');

                if(this.logger.isLevelEnabled('debug')) {
                    this.logger.debug(`Response: ${JSON.stringify(data)}`, 'ACCESS');
                }
            }),
            catchError((error) => {
                const responseTime = Date.now() - startTime;
                const statusCode = error.status || 500;

                const errorMessage = `${method} ${originalUrl} - ${statusCode} - ${responseTime}ms - IP: ${ip} - UserAgent: ${userAgent} - Error: ${error.message}`;

                this.logger.error(errorMessage, error.stack, 'ERROR');

                return throwError(() => error);
            })
        );
    }
}