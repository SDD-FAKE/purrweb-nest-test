import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { PrismaService } from 'src/prisma.service';
import { CardsModule } from 'src/cards/cards.module';

@Module({
    imports: [CardsModule],
    controllers: [ColumnsController],
    providers: [
        ColumnsService,
        PrismaService
    ],
    exports: []
})
export class ColumnsModule { }
