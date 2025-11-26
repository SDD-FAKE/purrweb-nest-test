import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CardsService } from './cards.service';
import { ColumnsService } from '../columns/columns.service';
import { PrismaService } from 'src/prisma.service';

describe('CardsService', () => {
    let service: CardsService;
    let prisma: PrismaService;
    let columnsService: ColumnsService;

    const mockPrismaService = {
        card: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        column: {
            findUnique: jest.fn(),
        },
    };

    const mockColumnsService = {
        findByOwnerAndColumnId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CardsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: ColumnsService,
                    useValue: mockColumnsService,
                },
            ],
        }).compile();

        service = module.get<CardsService>(CardsService);
        prisma = module.get<PrismaService>(PrismaService);
        columnsService = module.get<ColumnsService>(ColumnsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a card', async() => {
            const userId = 'user-1';
            const columnId = 'column-1';
            const createCardDto = {title: 'Test Card', description: 'Test Description'};
            const createdCard = {id: 'card-1', ...createCardDto, ownerId: userId, columnId};

            mockPrismaService.card.create.mockResolvedValue(createdCard);

            const result = await service.create(userId, columnId, createCardDto);

            expect(result).toEqual(createdCard);
            expect(prisma.card.create).toHaveBeenCalledWith({
                data: {
                    ownerId: userId,
                    columnId,
                    ...createCardDto,
                },
            });
        });
        it('should throw NotFoundException if column does not exist', async() => {
            mockPrismaService.card.create.mockRejectedValue(new Error('P2025'));

            await expect(
                service.create('user-1', 'missing', {title: 'title'})
            ).rejects.toThrow();
        });
    });

    describe('findOne', () => {
        it('should find card by id', async() => {
            const card = {id: 'card-1', title: 'Test Card'};
            mockPrismaService.card.findUnique.mockResolvedValue(card);

            const result = await service.findOne('card-1');

            expect(result).toEqual(card);
            expect(prisma.card.findUnique).toHaveBeenCalledWith({
                where: {
                    id: 'card-1'
                },
            });
        });

        it('should return null if card not found', async() => {
            mockPrismaService.card.findUnique.mockResolvedValue(null);

            const result = await service.findOne('non-existent-id');

            expect(result).toBeNull();
        });
    });

    describe('findOneOrThrow', () => {
        it('should return card if found', async() => {
            const card = {id: 'card-1', title: 'Test Card'};
            mockPrismaService.card.findUnique.mockResolvedValue(card);

            const result = await service.findOneOrThrow('card-1');

            expect(result).toEqual(card);
        });

        it('should throw NotFoundException if card not found', async() => {
            mockPrismaService.card.findUnique.mockResolvedValue(null);

            await expect(service.findOneOrThrow('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByColumnId', () => {
        it('should find cards by column id', async() => {
            const columnWithCards = {
                cards: [
                    {id: 'card-1', title: 'Card 1'},
                    {id: 'card-2', title: 'Card 2'},
                ],
            };
            mockPrismaService.column.findUnique.mockResolvedValue(columnWithCards);

            const result = await service.findByColumnId('column-1');

            expect(result).toEqual(columnWithCards.cards);
            expect(prisma.column.findUnique).toHaveBeenCalledWith({
                where: {id: 'column-1'},
                select: {cards: true},
            });
        });

        it('should throw NotFoundException if column not found', async() => {
            mockPrismaService.column.findUnique.mockResolvedValue(null);

            await expect(service.findByColumnId('non-existent-column')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        const existingCard = {
            id: 'card-1',
            title: 'Test Card',
            description: 'Test Description',
            columnId: 'column-1',
            ownerId: 'user-1',
        };

        beforeEach(() => {
            mockPrismaService.card.findUnique.mockResolvedValue(existingCard);
        });

        it('should update card without changing column', async() => {
            const updateData = {title: 'Updated Card'};
            const updatedCard = {...existingCard, ...updateData};
            mockPrismaService.card.update.mockResolvedValue(updatedCard);

            const result = await service.update('user-1', 'card-1', updateData);

            expect(result).toEqual(updatedCard);
            expect(prisma.card.update).toHaveBeenCalledWith({
                where: {id: 'card-1'},
                data: updateData,
            });
        });

        it('should update card and change column if user owns the target column', async() => {
            const updateData = {columnId: 'column-2'};
            const updatedCard = {...existingCard, ...updateData};
            const targetColumn = {id: 'column-2', ownerId: 'user-1'};

            mockColumnsService.findByOwnerAndColumnId.mockResolvedValue(targetColumn);
            mockPrismaService.card.update.mockResolvedValue(updatedCard);

            const result = await service.update('user-1', 'card-1', updateData);

            expect(result).toEqual(updatedCard);
            expect(columnsService.findByOwnerAndColumnId).toHaveBeenCalledWith('user-1', 'column-2');
            expect(prisma.card.update).toHaveBeenCalledWith({
                where: {id: 'card-1'},
                data: updateData,
            });
        });

        it('should throw BadRequestException if user does not own target column', async() => {
            const updateData = {columnId: 'column-2'};

            mockColumnsService.findByOwnerAndColumnId.mockResolvedValue(null);

            await expect(service.update('user-1', 'card-1', updateData)).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException if card does not exist', async() => {
            mockPrismaService.card.findUnique.mockResolvedValue(null);

            await expect(
                service.update('user-1', 'missing-card', {title: 'title'})
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete card and return success', async() => {
            mockPrismaService.card.delete.mockResolvedValue({} as any);

            const result = await service.delete('card-1');

            expect(result).toEqual({success: true});
            expect(prisma.card.delete).toHaveBeenCalledWith({
                where: {id: 'card-1'},
            });
        });
        it('should throw if prisma fails during delete', async() => {
            mockPrismaService.card.delete.mockRejectedValue(new Error('delete failed'));

            await expect(service.delete('card-1')).rejects.toThrow('delete failed');
        });
    });
});