import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';
import { isDev } from 'src/common';

export const createWinstonLogger = (configService: ConfigService): winston.Logger => {
    const isProduction = !isDev(configService);

    const filterPrismaErrorsFormat = winston.format((info) => {
        return info;
    });

    const transports: winston.transport[] = [
        new winston.transports.DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: isProduction ? 'info' : 'debug',
            format: winston.format.combine(
                filterPrismaErrorsFormat(),
                winston.format.timestamp(),
                winston.format.printf(({timestamp, level, message, context, trace}) => {
                    let output = `${timestamp} [${(context || 'APP').toString().toUpperCase()}] ${level.toUpperCase()}: ${message}`;
                    if(trace) output += `\nTRACE: ${trace}`;
                    return output;
                }),
            ),
        }),

        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(
                filterPrismaErrorsFormat(),
                winston.format.timestamp(),
                winston.format.printf(({timestamp, level, message, context, trace}) => {
                    let output = `${timestamp} [${(context || 'APP').toString().toUpperCase()}] ${level.toUpperCase()}: ${message}`;
                    if(trace) output += `\nTRACE: ${trace}`;
                    return output;
                }),
            ),
        }),
    ];

    return winston.createLogger({
        transports,
        exitOnError: false,
    });
};