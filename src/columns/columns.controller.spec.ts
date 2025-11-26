import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { CardsService } from '../cards/cards.service';
import { OwnershipGuard } from 'src/common';
import { NotFoundException } from '@nestjs/common';

describe('ColumnsController', () => {
    let controller: ColumnsController;

    const mockColumnsService = {
        create: jest.fn(),
        findByOwnerId: jest.fn(),
        findOneOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockCardsService = {
        findByColumnId: jest.fn(),
        create: jest.fn(),
    };

    const mockOwnershipGuard = {
        canActivate: jest.fn(() => true),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ColumnsController],
            providers: [
                {
                    provide: ColumnsService,
                    useValue: mockColumnsService,
                },
                {
                    provide: CardsService,
                    useValue: mockCardsService,
                },
            ],
        })
            .overrideGuard(OwnershipGuard)
            .useValue(mockOwnershipGuard)
            .compile();

        controller = module.get<ColumnsController>(ColumnsController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a column', async() => {
            const createColumnDto = {title: 'New Column'};
            const createdColumn = {id: 'column-1', ...createColumnDto};

            mockColumnsService.create.mockResolvedValue(createdColumn);

            const result = await controller.create('user-1', createColumnDto);

            expect(result).toEqual(createdColumn);
            expect(mockColumnsService.create).toHaveBeenCalledWith('user-1', createColumnDto);
        });
    });

    describe('find', () => {
        it('should find user columns', async() => {
            const columns = [
                {id: 'column-1', title: 'Column 1'},
                {id: 'column-2', title: 'Column 2'},
            ];
            mockColumnsService.findByOwnerId.mockResolvedValue(columns);

            const result = await controller.find('user-1');

            expect(result).toEqual(columns);
            expect(mockColumnsService.findByOwnerId).toHaveBeenCalledWith('user-1');
        });
    });

    describe('findOne', () => {
        it('should find column by id', async() => {
            const column = {id: 'column-1', title: 'Test Column'};
            mockColumnsService.findOneOrThrow.mockResolvedValue(column);

            const result = await controller.findOne('column-1');

            expect(result).toEqual(column);
            expect(mockColumnsService.findOneOrThrow).toHaveBeenCalledWith('column-1');
        });
    });

    describe('update', () => {
        it('should update column', async() => {
            const updateColumnDto = {title: 'Updated Column'};
            const updatedColumn = {id: 'column-1', ...updateColumnDto};

            mockColumnsService.update.mockResolvedValue(updatedColumn);

            const result = await controller.update('column-1', updateColumnDto);

            expect(result).toEqual(updatedColumn);
            expect(mockColumnsService.update).toHaveBeenCalledWith('column-1', updateColumnDto);
        });

        it('should throw if service throws NotFoundException', async() => {
            mockColumnsService.update.mockRejectedValue(new NotFoundException());

            await expect(controller.update('missing', {title: 'title'})).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete column', async() => {
            const deleteResult = {success: true};
            mockColumnsService.delete.mockResolvedValue(deleteResult);

            const result = await controller.delete('column-1');

            expect(result).toEqual(deleteResult);
            expect(mockColumnsService.delete).toHaveBeenCalledWith('column-1');
        });

        it('should throw if delete fails', async() => {
            mockColumnsService.delete.mockRejectedValue(new NotFoundException());

            await expect(controller.delete('missing-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findCards', () => {
        it('should find column cards', async() => {
            const cards = [
                {id: 'card-1', title: 'Card 1'},
                {id: 'card-2', title: 'Card 2'},
            ];
            mockCardsService.findByColumnId.mockResolvedValue(cards);

            const result = await controller.findCards('column-1');

            expect(result).toEqual(cards);
            expect(mockCardsService.findByColumnId).toHaveBeenCalledWith('column-1');
        });
    });

    describe('createCard', () => {
        it('should create card in column', async() => {
            const createCardDto = {title: 'New Card', description: 'Card description'};
            const createdCard = {id: 'card-1', ...createCardDto};

            mockCardsService.create.mockResolvedValue(createdCard);

            const result = await controller.createCard('user-1', 'column-1', createCardDto);

            expect(result).toEqual(createdCard);
            expect(mockCardsService.create).toHaveBeenCalledWith('user-1', 'column-1', createCardDto);
        });

        it('should throw if service.create throws error', async() => {
            mockCardsService.create.mockRejectedValue(new Error('fail'));

            await expect(controller.createCard('user-1', 'col-1', {title: 'title'})).rejects.toThrow('fail');
        });
    });
});