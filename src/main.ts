import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/config.interface';
import cookieParser from 'cookie-parser';
import { isDev, LoggingInterceptor } from './common';
import { setupSwagger } from './swagger';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const conf = app.get(ConfigService<AppConfig>);
    const logger = app.get(LoggerService);
    
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.use(cookieParser());
    app.useLogger(logger);
    app.useGlobalInterceptors(new LoggingInterceptor(logger));

    if(isDev(conf)) setupSwagger(app, conf);

    await app.listen(conf.get('port') ?? 3000);
}
bootstrap();
