import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaService } from 'src/prisma.service';
import { CommentsModule } from 'src/comments/comments.module';
import { ColumnsService } from 'src/columns/columns.service';

@Module({
    imports: [CommentsModule],
    controllers: [CardsController],
    providers: [
        CardsService,
        ColumnsService,
        PrismaService
    ],
    exports: [
        CardsService
    ]
})
export class CardsModule { }
