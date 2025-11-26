import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateColumnDTO, UpdateColumnDTO } from './dto';

@Injectable()
export class ColumnsService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async create(userId: string, dto: CreateColumnDTO) {
        return await this.prismaService.column.create({
            data: {
                ...dto,
                ownerId: userId,
            }
        });
    }

    async findOne(columnId: string) {
        return await this.prismaService.column.findUnique({
            where: {
                id: columnId
            }
        });
    }

    async findOneOrThrow(columnId: string) {
        const column = await this.findOne(columnId);

        if(!column) {
            throw new NotFoundException('Entity not found');
        }

        return column;
    }

    async findByOwnerId(ownerId: string) {
        return await this.prismaService.column.findMany({
            where: {
                ownerId
            }
        });
    }

    async findByOwnerAndColumnId(ownerId: string, columnId: string) {
        return await this.prismaService.column.findUnique({
            where: {
                id: columnId,
                ownerId
            }
        });
    }

    async update(columnId: string, dto: UpdateColumnDTO) {
        return await this.prismaService.column.update({
            where: {
                id: columnId
            },
            data: dto
        });
    }

    async delete(columnId: string) {
        await this.prismaService.column.delete({
            where: {
                id: columnId
            }
        });

        return {success: true};
    }
}
