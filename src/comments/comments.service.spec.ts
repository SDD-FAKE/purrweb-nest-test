import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PrismaService } from 'src/prisma.service';

describe('CommentsService', () => {
    let service: CommentsService;
    let prisma: PrismaService;

    const mockPrismaService = {
        comment: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        card: {
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<CommentsService>(CommentsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a comment', async() => {
            const userId = 'user-1';
            const cardId = 'card-1';
            const createCommentDto = {
                text: 'Test comment'
            };
            const createdComment = {
                id: 'comment-1',
                ...createCommentDto,
                ownerId: userId,
                cardId
            };

            mockPrismaService.comment.create.mockResolvedValue(createdComment);

            const result = await service.create(userId, cardId, createCommentDto);

            expect(result).toEqual(createdComment);
            expect(prisma.comment.create).toHaveBeenCalledWith({
                data: {
                    ownerId: userId,
                    cardId,
                    ...createCommentDto,
                },
            });
        });
        it('should throw if prisma.create fails', async() => {
            mockPrismaService.comment.create.mockRejectedValue(new Error('create failed'));

            await expect(
                service.create('user-1', 'card-1', {text: 'text'})
            ).rejects.toThrow('create failed');
        });
    });

    describe('findOne', () => {
        it('should find comment by id', async() => {
            const comment = {id: 'comment-1', text: 'Test comment'};
            mockPrismaService.comment.findUnique.mockResolvedValue(comment);

            const result = await service.findOne('comment-1');

            expect(result).toEqual(comment);
            expect(prisma.comment.findUnique).toHaveBeenCalledWith({
                where: {
                    id: 'comment-1'
                },
            });
        });

        it('should return null if comment not found', async() => {
            mockPrismaService.comment.findUnique.mockResolvedValue(null);

            const result = await service.findOne('non-existent-id');

            expect(result).toBeNull();
        });
    });

    describe('findOneOrThrow', () => {
        it('should return comment if found', async() => {
            const comment = {id: 'comment-1', text: 'Test comment'};
            mockPrismaService.comment.findUnique.mockResolvedValue(comment);

            const result = await service.findOneOrThrow('comment-1');

            expect(result).toEqual(comment);
        });

        it('should throw NotFoundException if comment not found', async() => {
            mockPrismaService.comment.findUnique.mockResolvedValue(null);

            await expect(service.findOneOrThrow('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByCardId', () => {
        it('should find comments by card id', async() => {
            const cardWithComments = {
                comments: [
                    {id: 'comment-1', text: 'Comment 1'},
                    {id: 'comment-2', text: 'Comment 2'},
                ],
            };
            mockPrismaService.card.findUnique.mockResolvedValue(cardWithComments);

            const result = await service.findByCardId('card-1');

            expect(result).toEqual(cardWithComments.comments);
            expect(prisma.card.findUnique).toHaveBeenCalledWith({
                where: {id: 'card-1'},
                select: {comments: true},
            });
        });

        it('should throw NotFoundException if card not found', async() => {
            mockPrismaService.card.findUnique.mockResolvedValue(null);

            await expect(service.findByCardId('non-existent-card')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update comment', async() => {
            const updateData = {text: 'Updated comment'};
            const updatedComment = {id: 'comment-1', ...updateData};
            mockPrismaService.comment.update.mockResolvedValue(updatedComment);

            const result = await service.update('comment-1', updateData);

            expect(result).toEqual(updatedComment);
            expect(prisma.comment.update).toHaveBeenCalledWith({
                where: {
                    id: 'comment-1'
                },
                data: updateData,
            });
        });

        it('should throw NotFoundException if comment does not exist', async() => {
            mockPrismaService.comment.update.mockRejectedValue(new Error('P2025'));

            await expect(service.update('missing-id', {text: 'text'})).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete comment and return success', async() => {
            mockPrismaService.comment.delete.mockResolvedValue({} as any);

            const result = await service.delete('comment-1');

            expect(result).toEqual({success: true});
            expect(prisma.comment.delete).toHaveBeenCalledWith({
                where: {
                    id: 'comment-1'
                },
            });
        });

        it('should throw if prisma.delete fails', async() => {
            mockPrismaService.comment.delete.mockRejectedValue(new Error('delete failed'));

            await expect(service.delete('comment-1')).rejects.toThrow('delete failed');
        });
    });
});