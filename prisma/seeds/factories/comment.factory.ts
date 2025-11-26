import { Comment } from 'src/common/generated/prisma/client';
import { BaseFactory } from './base.factory';

export class CommentFactory extends BaseFactory<Comment> {
    async create(data: {
        text: string;
        ownerId: string;
        cardId: string;
    }): Promise<Comment> {
        return this.prisma.comment.create({
            data: {
                text: data.text,
                ownerId: data.ownerId,
                cardId: data.cardId,
            },
        });
    }

    async createMany(commentsData: {
        text: string;
        ownerId: string;
        cardId: string;
    }[]): Promise<Comment[]> {
        return Promise.all(
            commentsData.map(commentData => this.create(commentData))
        );
    }

    async createForCards(
        commentsData: {text: string; ownerId: string; cardId: string}[]
    ): Promise<Comment[]> {
        return this.createMany(commentsData);
    }
}