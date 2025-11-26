import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { PrismaService } from 'src/prisma.service';

describe('ColumnsService', () => {
    let service: ColumnsService;
    let prisma: PrismaService;

    const mockPrismaService = {
        column: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ColumnsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ColumnsService>(ColumnsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a column', async() => {
            const userId = 'user-1';
            const createColumnDto = {title: 'Test Column'};
            const createdColumn = {
                id: 'column-1',
                ...createColumnDto,
                ownerId: userId
            };

            mockPrismaService.column.create.mockResolvedValue(createdColumn);

            const result = await service.create(userId, createColumnDto);

            expect(result).toEqual(createdColumn);
            expect(prisma.column.create).toHaveBeenCalledWith({
                data: {
                    ...createColumnDto,
                    ownerId: userId,
                },
            });
        });
    });

    describe('findOne', () => {
        it('should find column by id', async() => {
            const column = {id: 'column-1', title: 'Test Column'};
            mockPrismaService.column.findUnique.mockResolvedValue(column);

            const result = await service.findOne('column-1');

            expect(result).toEqual(column);
            expect(prisma.column.findUnique).toHaveBeenCalledWith({
                where: {
                    id: 'column-1'
                }
            });
        });

        it('should return null if column not found', async() => {
            mockPrismaService.column.findUnique.mockResolvedValue(null);

            const result = await service.findOne('non-existent-id');

            expect(result).toBeNull();
        });
    });

    describe('findOneOrThrow', () => {
        it('should return column if found', async() => {
            const column = {id: 'column-1', title: 'Test Column'};
            mockPrismaService.column.findUnique.mockResolvedValue(column);

            const result = await service.findOneOrThrow('column-1');

            expect(result).toEqual(column);
        });

        it('should throw NotFoundException if column not found', async() => {
            mockPrismaService.column.findUnique.mockResolvedValue(null);

            await expect(service.findOneOrThrow('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByOwnerId', () => {
        it('should find columns by owner id', async() => {
            const columns = [
                {id: 'column-1', title: 'Column 1', ownerId: 'user-1'},
                {id: 'column-2', title: 'Column 2', ownerId: 'user-1'},
            ];
            mockPrismaService.column.findMany.mockResolvedValue(columns);

            const result = await service.findByOwnerId('user-1');

            expect(result).toEqual(columns);
            expect(prisma.column.findMany).toHaveBeenCalledWith({
                where: {
                    ownerId: 'user-1'
                },
            });
        });
    });

    describe('findByOwnerAndColumnId', () => {
        it('should find column by owner and column id', async() => {
            const column = {id: 'column-1', title: 'Test Column', ownerId: 'user-1'};
            mockPrismaService.column.findUnique.mockResolvedValue(column);

            const result = await service.findByOwnerAndColumnId('user-1', 'column-1');

            expect(result).toEqual(column);
            expect(prisma.column.findUnique).toHaveBeenCalledWith({
                where: {
                    id: 'column-1', 
                    ownerId: 'user-1'
                },
            });
        });
    });

    describe('update', () => {
        it('should update column', async() => {
            const updateData = {title: 'Updated Column'};
            const updatedColumn = {id: 'column-1', ...updateData};
            mockPrismaService.column.update.mockResolvedValue(updatedColumn);

            const result = await service.update('column-1', updateData);

            expect(result).toEqual(updatedColumn);
            expect(prisma.column.update).toHaveBeenCalledWith({
                where: {
                    id: 'column-1'
                },
                data: updateData,
            });
        });
    });

    describe('delete', () => {
        it('should delete column and return success', async() => {
            mockPrismaService.column.delete.mockResolvedValue({} as any);

            const result = await service.delete('column-1');

            expect(result).toEqual({success: true});
            expect(prisma.column.delete).toHaveBeenCalledWith({
                where: {
                    id: 'column-1'
                },
            });
        });
    });
});