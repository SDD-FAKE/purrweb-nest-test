import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
    let controller: UsersController;

    const mockUsersService = {
        update: jest.fn(),
        getSafeUser: jest.fn(),
    };

    const mockCurrentUser = {
        id: '1',
        email: 'test@test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getCurrentUser', () => {
        it('should return current user', () => {
            const result = controller.getCurrentUser(mockCurrentUser);

            expect(result).toEqual(mockCurrentUser);
        });
    });

    describe('updateCurrentUser', () => {
        it('should update current user', async() => {
            const updateData = {email: 'new@test.com'};
            const updatedUser = {...mockCurrentUser, ...updateData};

            mockUsersService.update.mockResolvedValue(updatedUser);

            const result = await controller.updateCurrentUser('1', updateData);

            expect(result).toEqual(updatedUser);
            expect(mockUsersService.update).toHaveBeenCalledWith('1', updateData);
        });

        it('should throw if service.update throws NotFoundException', async() => {
            mockUsersService.update.mockRejectedValue(new NotFoundException());

            await expect(controller.updateCurrentUser('1', {email: 'x@test.com'})).rejects.toThrow(NotFoundException);
        });
    });

    describe('findOne', () => {
        it('should return safe user by id', async() => {
            const safeUser = {...mockCurrentUser};
            mockUsersService.getSafeUser.mockResolvedValue(safeUser);

            const result = await controller.findOne('1');

            expect(result).toEqual(safeUser);
            expect(mockUsersService.getSafeUser).toHaveBeenCalledWith('1');
        });

        it('should throw if service.getSafeUser throws NotFoundException', async() => {
            mockUsersService.getSafeUser.mockRejectedValue(new NotFoundException());

            await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
        });
    });
});