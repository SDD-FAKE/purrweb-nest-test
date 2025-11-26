import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';
import { createWinstonLogger } from 'src/config';
import { isDev } from 'src/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
    private logger: winston.Logger;

    constructor(configService: ConfigService) {
        super();

        super.setLogLevels([
            'fatal',
            'error',
            'warn',
            'log',
            ...(isDev(configService) ? (['verbose', 'debug'] as const) : [])
        ]);

        this.logger = createWinstonLogger(configService);
    }

    log(message: string, context?: string) {
        this.logger.info(message, {context});

        super.log(message, context);
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, {trace, context});

        super.error(message, context);
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, {context});

        super.warn(message, context);
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, {context});

        super.debug(message, context);
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, {context});

        super.verbose(message, context);
    }
}