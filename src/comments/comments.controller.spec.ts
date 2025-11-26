import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { OwnershipGuard } from 'src/common';
import { NotFoundException } from '@nestjs/common';

const mockOwnershipGuard = { canActivate: jest.fn(() => true) };

describe('CommentsController', () => {
    let controller: CommentsController;

    const mockCommentsService = {
        findOneOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CommentsController],
            providers: [
                {
                    provide: CommentsService,
                    useValue: mockCommentsService,
                },
            ],
        })
            .overrideGuard(OwnershipGuard)
            .useValue(mockOwnershipGuard)
            .compile();

        controller = module.get<CommentsController>(CommentsController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findOne', () => {
        it('should find comment by id', async() => {
            const comment = {id: 'comment-1', text: 'Test comment'};
            mockCommentsService.findOneOrThrow.mockResolvedValue(comment);

            const result = await controller.findOne('comment-1');

            expect(result).toEqual(comment);
            expect(mockCommentsService.findOneOrThrow).toHaveBeenCalledWith('comment-1');
        });
        it('should throw if service.findOneOrThrow throws', async() => {
            mockCommentsService.findOneOrThrow.mockRejectedValue(new NotFoundException());

            await expect(controller.findOne('missing')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update',() => {
        it('should update comment', async() => {
            const updateCommentDto = {text: 'Updated comment'};
            const updatedComment = {id: 'comment-1', ...updateCommentDto};

            mockCommentsService.update.mockResolvedValue(updatedComment);

            const result = await controller.update('comment-1', updateCommentDto);

            expect(result).toEqual(updatedComment);
            expect(mockCommentsService.update).toHaveBeenCalledWith('comment-1', updateCommentDto);
        });
    });

    describe('delete', () => {
        it('should delete comment', async() => {
            const deleteResult = {success: true};
            mockCommentsService.delete.mockResolvedValue(deleteResult);

            const result = await controller.delete('comment-1');

            expect(result).toEqual(deleteResult);
            expect(mockCommentsService.delete).toHaveBeenCalledWith('comment-1');
        });
        it('should throw if delete fails', async() => {
            mockCommentsService.delete.mockRejectedValue(new NotFoundException());

            await expect(controller.delete('comment-1')).rejects.toThrow(NotFoundException);
        });
    });
});