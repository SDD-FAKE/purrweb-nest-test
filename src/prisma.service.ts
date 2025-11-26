
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config';
import { PrismaClient } from './common/generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(
        configService: ConfigService<AppConfig>
    ) {
        const adapter = new PrismaPg({connectionString: configService.get<string>('database_url')});
        super({adapter});
    }
}
