import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';

describe('UsersService', () => {
    let service: UsersService;
    let prisma: PrismaService;

    const mockPrismaService = {
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a user', async() => {
            const userData = {
                email: 'test@test.com',
                passwordHash: 'hashed_password',
            };
            const createdUser = {
                id: '1', 
                ...userData
            };

            mockPrismaService.user.create.mockResolvedValue(createdUser);

            const result = await service.create(userData);

            expect(result).toEqual(createdUser);
            expect(prisma.user.create).toHaveBeenCalledWith({data: userData});
        });

        it('should throw ConflictException if email already exists on create', async() => {
            mockPrismaService.user.count.mockResolvedValue(1);

            await expect(
                service.create({
                    email: 'test@test.com', 
                    passwordHash: '123'
                })
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('findById', () => {
        it('should find user by id', async() => {
            const user = {id: '1', email: 'test@test.com'};
            mockPrismaService.user.findUnique.mockResolvedValue(user);

            const result = await service.findById('1');

            expect(result).toEqual(user);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: {
                    id: '1'
                },
            });
        });

        it('should return null if user not found', async() => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            const result = await service.findById('999');

            expect(result).toBeNull();
        });
    });

    describe('findByEmail', () => {
        it('should find user by email', async() => {
            const user = {id: '1', email: 'test@test.com'};
            mockPrismaService.user.findUnique.mockResolvedValue(user);

            const result = await service.findByEmail('test@test.com');

            expect(result).toEqual(user);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: {email: 'test@test.com'},
            });
        });

        it('should throw error if prisma throws on findByEmail', async() => {
            mockPrismaService.user.findUnique.mockRejectedValue(new Error('DB error'));

            await expect(service.findByEmail('test@test.com')).rejects.toThrow('DB error');
        });
    });

    describe('update', () => {
        const existingUser = {
            id: '1',
            email: 'old@test.com',
            passwordHash: 'hash',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        beforeEach(() => {
            mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
        });

        it('should update user and return safe user without passwordHash', async() => {
            const updateData = {email: 'new@test.com'};

            const updatedUserFromPrisma = {
                ...existingUser,
                ...updateData
            };

            const expectedSafeUser = {
                id: '1',
                email: 'new@test.com',
                createdAt: existingUser.createdAt,
                updatedAt: existingUser.updatedAt,
            };

            mockPrismaService.user.count.mockResolvedValue(0);
            mockPrismaService.user.update.mockResolvedValue(updatedUserFromPrisma);

            const result = await service.update('1', updateData);

            expect(result).toEqual(expectedSafeUser);
            //@ts-ignore
            expect(result.passwordHash).toBeUndefined();
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: updateData,
            });
        });

        it('should throw NotFoundException if user not found', async() => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.update('999', {email: 'new@test.com'})).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException if email already exists', async() => {
            mockPrismaService.user.count.mockResolvedValue(1);

            await expect(service.update('1', {email: 'existing@test.com'})).rejects.toThrow(ConflictException);
        });
    });

    describe('getSafeUser', () => {
        it('should return user without passwordHash', async() => {
            const userWithPassword = {
                id: '1',
                email: 'test@test.com',
                passwordHash: 'secret',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrismaService.user.findUnique.mockResolvedValue(userWithPassword);

            const result = await service.getSafeUser('1');

            expect(result).toEqual({
                id: '1',
                email: 'test@test.com',
                createdAt: userWithPassword.createdAt,
                updatedAt: userWithPassword.updatedAt,
            });
            //@ts-ignore
            expect(result.passwordHash).toBeUndefined();
        });

        it('should throw NotFoundException if user not found', async() => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.getSafeUser('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('userWithEmailExist', () => {
        it('should return true if email exists', async() => {
            mockPrismaService.user.count.mockResolvedValue(1);

            const result = await service.userWithEmailExist('test@test.com');

            expect(result).toBe(true);
            expect(prisma.user.count).toHaveBeenCalledWith({
                where: {email: 'test@test.com'}
            });
        });

        it('should return false if email does not exist', async() => {
            mockPrismaService.user.count.mockResolvedValue(0);

            const result = await service.userWithEmailExist('test@test.com');

            expect(result).toBe(false);
        });
    });

    describe('delete', () => {
        it('should delete user', async() => {
            const deletedUser = {id: '1', email: 'test@test.com'};
            mockPrismaService.user.delete.mockResolvedValue(deletedUser);

            const result = await service.delete('1');

            expect(result).toEqual(deletedUser);
            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: {id: '1'}
            });
        });

        it('should throw error if prisma.delete fails', async() => {
            mockPrismaService.user.delete.mockRejectedValue(new Error('P2025'));

            await expect(service.delete('1')).rejects.toThrow(Error);
        });
    });
});