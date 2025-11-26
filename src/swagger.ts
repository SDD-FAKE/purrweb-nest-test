import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { AppConfig } from './config';

export function setupSwagger(app: INestApplication, configService: ConfigService<AppConfig>) {
    const theme = new SwaggerTheme();
    const config = new DocumentBuilder()
        .setTitle('Nest.JS Test')
        .setDescription(`
Nest.JS Test System API

Main Entities:
- Users - System users who can create and manage their tasks
- Columns - Containers for organizing cards (like "To Do", "In Progress", "Done")
- Cards - Individual tasks or items that can be moved between columns
- Comments - User discussions and notes attached to cards
        
Authentication:
- Uses JWT tokens with access token in Authorization header
- Uses HTTP-only cookies for refresh tokens (automatically managed by browser. Not working in swagger - use e.g. Postman)
- Refresh tokens are sent automatically with every request

P.S. Watch this https://github.com/SDD-FAKE/purrweb-nest-test?tab=readme-ov-file#faq- to find answers to questions.
        `)
        .setVersion('1.0')
        .addBearerAuth(undefined, 'JWT-auth')
        .build();
    const options = {
        customCss: theme.getBuffer(configService.get('swagger_theme') || SwaggerThemeNameEnum.CLASSIC),
        swaggerOptions: {
            persistAuthorization: true
        },
    };

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory, options);
}
