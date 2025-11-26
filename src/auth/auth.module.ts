import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from '../common/strategies';
import { AppConfig, getJwtConfig, } from 'src/config';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/common/guards/';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService<AppConfig>],
            useFactory: getJwtConfig
        }),
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        AuthService, 
        PrismaService, 
        JwtStrategy,
        UsersService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
    exports: [
        AuthService
    ]
})
export class AuthModule { }
