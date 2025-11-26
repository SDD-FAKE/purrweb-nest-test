import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { validateEnv } from './config/env.validation';
import { PrismaService } from './prisma.service'
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';
import { CommentsModule } from './comments/comments.module';
import { LoggerModule } from './logger/logger.module';

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true,
        validate: validateEnv,
        load: [config]
    }), AuthModule, UsersModule, ColumnsModule, CardsModule, CommentsModule, LoggerModule],
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService]
})
export class AppModule { }
