import { Column } from 'src/common/generated/prisma/client';
import { BaseFactory } from './base.factory';

export class ColumnFactory extends BaseFactory<Column> {
    async create(data: {title: string; ownerId: string}): Promise<Column> {
        return this.prisma.column.create({
            data: {
                title: data.title,
                ownerId: data.ownerId,
            },
        });
    }

    async createMany(columnsData: {title: string; ownerId: string}[]): Promise<Column[]> {
        return Promise.all(
            columnsData.map(columnData => this.create(columnData))
        );
    }

    async createForUser(userId: string, titles: string[]): Promise<Column[]> {
        const columnsData = titles.map(title => ({title, ownerId: userId}));

        return this.createMany(columnsData);
    }
}