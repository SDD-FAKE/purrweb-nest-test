import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCardDTO, UpdateCardDTO } from './dto';
import { ColumnsService } from 'src/columns/columns.service';

@Injectable()
export class CardsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly columnService: ColumnsService
    ) { }

    async create(ownerId: string, columnId: string, dto: CreateCardDTO) {
        return await this.prismaService.card.create({
            data: {
                ownerId,
                columnId,
                ...dto
            }
        });
    }

    async findOne(cardId: string) {
        return await this.prismaService.card.findUnique({
            where: {
                id: cardId
            }
        });
    }

    async findOneOrThrow(cardId: string) {
        const card = await this.findOne(cardId);

        if(!card) {
            throw new NotFoundException('Card not found');
        }

        return card;
    }

    async findByColumnId(columnId: string) {
        const column = await this.prismaService.column.findUnique({
            where: {
                id: columnId
            },
            select: {
                cards: true
            }
        });

        if(!column) {
            throw new NotFoundException('Column not found')
        }

        return column.cards;
    }

    async update(userId: string, cardId: string, dto: UpdateCardDTO) {
        const card = await this.findOneOrThrow(cardId);

        if(dto.columnId && dto.columnId !== card.columnId) {
            const column = await this.columnService.findByOwnerAndColumnId(userId, dto.columnId);

            if(!column) {
                throw new BadRequestException('User does not have column with this ID');
            }
        }

        return await this.prismaService.card.update({
            where: {
                id: cardId
            },
            data: dto,
        });
    }

    async delete(cardId: string) {
        await this.prismaService.card.delete({
            where: {
                id: cardId
            }
        });

        return {success: true};
    }
}
