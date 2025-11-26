import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCommentDTO, UpdateCommentDTO } from './dto';

@Injectable()
export class CommentsService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async create(ownerId: string, cardId: string, dto: CreateCommentDTO) {
        return await this.prismaService.comment.create({
            data: {
                ownerId,
                cardId,
                ...dto
            }
        });
    }

    async findOne(commentId: string) {
        return this.prismaService.comment.findUnique({
            where: {
                id: commentId
            }
        });
    }

    async findOneOrThrow(commentId: string) {
        const comment = await this.findOne(commentId);

        if(!comment) {
            throw new NotFoundException('Entity not found');
        }

        return comment;
    }

    async findByCardId(cardId: string) {
        const card = await this.prismaService.card.findUnique({
            where: {
                id: cardId
            },
            select: {
                comments: true
            }
        });

        if(!card) {
            throw new NotFoundException('Entity not found');
        }

        return card.comments;
    }

    async update(commentId: string, dto: UpdateCommentDTO) {
        return await this.prismaService.comment.update({
            where: {
                id: commentId
            },
            data: dto
        });
    }

    async delete(commentId: string) {
        await this.prismaService.comment.delete({
            where: {
                id: commentId
            }
        });

        return {success: true};
    }
}
