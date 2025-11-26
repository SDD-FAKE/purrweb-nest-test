import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CommentsService } from '../comments/comments.service';
import { OwnershipGuard } from 'src/common';
import { NotFoundException } from '@nestjs/common';

const mockOwnershipGuard = { canActivate: jest.fn(() => true) };

describe('CardsController', () => {
    let controller: CardsController;

    const mockCardsService = {
        findOneOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockCommentsService = {
        findByCardId: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CardsController],
            providers: [
                {
                    provide: CardsService,
                    useValue: mockCardsService,
                },
                {
                    provide: CommentsService,
                    useValue: mockCommentsService,
                },
            ],
        })
            .overrideGuard(OwnershipGuard)
            .useValue(mockOwnershipGuard)
            .compile();

        controller = module.get<CardsController>(CardsController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findOne', () => {
        it('should find card by id', async() => {
            const card = {id: 'card-1', title: 'Test Card'};
            mockCardsService.findOneOrThrow.mockResolvedValue(card);

            const result = await controller.findOne('card-1');

            expect(result).toEqual(card);
            expect(mockCardsService.findOneOrThrow).toHaveBeenCalledWith('card-1');
        });
    });

    describe('update', () => {
        it('should update card', async() => {
            const updateCardDto = {title: 'Updated Card'};
            const updatedCard = {id: 'card-1', ...updateCardDto};

            mockCardsService.update.mockResolvedValue(updatedCard);

            const result = await controller.update('user-1', 'card-1', updateCardDto);

            expect(result).toEqual(updatedCard);
            expect(mockCardsService.update).toHaveBeenCalledWith('user-1', 'card-1', updateCardDto);
        });
        it('should throw if update fails', async() => {
            mockCardsService.update.mockRejectedValue(new Error('update failed'));

            await expect(controller.update('user-1', 'card-1', {title: 'title'})).rejects.toThrow('update failed');
        });
    });

    describe('delete', () => {
        it('should delete card', async() => {
            const deleteResult = {success: true};
            mockCardsService.delete.mockResolvedValue(deleteResult);

            const result = await controller.delete('card-1');

            expect(result).toEqual(deleteResult);
            expect(mockCardsService.delete).toHaveBeenCalledWith('card-1');
        });
        it('should throw if delete fails', async() => {
            mockCardsService.delete.mockRejectedValue(new NotFoundException());

            await expect(controller.delete('card-1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findComments', () => {
        it('should find card comments', async() => {
            const comments = [
                {id: 'comment-1', text: 'Comment 1'},
                {id: 'comment-2', text: 'Comment 2'},
            ];
            mockCommentsService.findByCardId.mockResolvedValue(comments);

            const result = await controller.findComments('card-1');

            expect(result).toEqual(comments);
            expect(mockCommentsService.findByCardId).toHaveBeenCalledWith('card-1');
        });
        it('should throw if comments service fails', async() => {
            mockCommentsService.findByCardId.mockRejectedValue(new Error('fail'));

            await expect(controller.findComments('card-1')).rejects.toThrow('fail');
        });
    });

    describe('createComment', () => {
        it('should create comment on card', async() => {
            const createCommentDto = {text: 'New Comment'};
            const createdComment = {id: 'comment-1', ...createCommentDto};

            mockCommentsService.create.mockResolvedValue(createdComment);

            const result = await controller.createComment('user-1', 'card-1', createCommentDto);

            expect(result).toEqual(createdComment);
            expect(mockCommentsService.create).toHaveBeenCalledWith('user-1', 'card-1', createCommentDto);
        });

        it('should throw if create service fails', async() => {
            mockCommentsService.create.mockRejectedValue(new Error('fail'));

            await expect(
                controller.createComment('user-1', 'card-1', {text: 'hi'})
            ).rejects.toThrow('fail');
        });
    });
});