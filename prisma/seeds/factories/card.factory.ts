import { Card } from 'src/common/generated/prisma/client';
import { BaseFactory } from './base.factory';

export class CardFactory extends BaseFactory<Card> {
    async create(data: {
        title: string;
        description?: string;
        ownerId: string;
        columnId: string;
    }): Promise<Card> {
        return this.prisma.card.create({
            data: {
                title: data.title,
                description: data.description,
                ownerId: data.ownerId,
                columnId: data.columnId,
            },
        });
    }

    async createMany(cardsData: {
        title: string;
        description?: string;
        ownerId: string;
        columnId: string;
    }[]): Promise<Card[]> {
        return Promise.all(
            cardsData.map(cardData => this.create(cardData))
        );
    }

    async createForColumn(
        ownerId: string,
        columnId: string,
        cardsData: { title: string; description?: string }[]
    ): Promise<Card[]> {
        const cardsWithIds = cardsData.map(cardData => ({
            ...cardData,
            ownerId,
            columnId,
        }));

        return this.createMany(cardsWithIds);
    }
}