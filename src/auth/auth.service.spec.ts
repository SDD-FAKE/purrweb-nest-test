import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;

    const mockUsersService = {
        userWithEmailExist: jest.fn(),
        create: jest.fn(),
        findByEmail: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
        verifyAsync: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn(),
    };

    const mockResponse = () => {
        const res: any = {};
        res.cookie = jest.fn().mockReturnValue(res);
        return res;
    };

    const mockRequest = () => {
        const req: any = {};
        req.cookies = {};
        return req;
    };

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);

        mockConfigService.get.mockImplementation((key: string) => {
            switch(key) {
                case 'jwt_access_token_ttl': 
                    return '2h';
                case 'jwt_refresh_token_ttl': 
                    return '7d';
                case 'cookie_domain': 
                    return 'localhost';
                default: 
                    return null;
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user', async() => {
            const registerDto = {email: 'test@test.com', password: 'password123'};
            const hashedPassword = 'hashed_password';
            const user = {id: '1', email: registerDto.email, passwordHash: hashedPassword};
            const tokens = {accessToken: 'access_token', refreshToken: 'refresh_token'};
            const res = mockResponse();

            mockUsersService.userWithEmailExist.mockResolvedValue(false);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            mockUsersService.create.mockResolvedValue(user);
            jest.spyOn(service as any, 'auth').mockResolvedValue(tokens);

            const result = await service.register(res, registerDto);

            expect(result).toEqual(tokens);
            expect(usersService.userWithEmailExist).toHaveBeenCalledWith(registerDto.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
            expect(usersService.create).toHaveBeenCalledWith({
                email: registerDto.email,
                passwordHash: hashedPassword,
            });
        });

        it('should throw ConflictException if email already exists', async() => {
            const registerDto = {email: 'test@test.com', password: 'password123'};
            const res = mockResponse();

            mockUsersService.userWithEmailExist.mockResolvedValue(true);

            await expect(service.register(res, registerDto))
                .rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        it('should login user with valid credentials', async() => {
            const loginDto = {email: 'test@test.com', password: 'password123'};
            const user = {id: '1', email: loginDto.email, passwordHash: 'hashed_password'};
            const tokens = {accessToken: 'access_token', refreshToken: 'refresh_token'};
            const res = mockResponse();

            mockUsersService.findByEmail.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            jest.spyOn(service as any, 'auth').mockResolvedValue(tokens);

            const result = await service.login(res, loginDto);

            expect(result).toEqual(tokens);
            expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, user.passwordHash);
        });

        it('should set refresh token cookie on login', async () => {
            const loginDto = {email: 'test@test.com', password: 'password123'};
            const user = {id: '1', email: loginDto.email, passwordHash: 'hashed_password'};
            const res = mockResponse();

            mockUsersService.findByEmail.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            mockJwtService.signAsync
                .mockResolvedValueOnce('access_token')
                .mockResolvedValueOnce('refresh_token');

            const result = await service.login(res, loginDto);

            expect(result).toEqual({
                accessToken: 'access_token'
            });

            expect(res.cookie).toHaveBeenCalledWith(
                'refresh_token',
                'refresh_token',
                expect.objectContaining({
                    httpOnly: true,
                    domain: 'localhost',
                }),
            );
        });

        it('should throw NotFoundException if user not found', async() => {
            const loginDto = {email: 'test@test.com', password: 'password123'};
            const res = mockResponse();

            mockUsersService.findByEmail.mockResolvedValue(null);

            await expect(service.login(res, loginDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if password is invalid', async() => {
            const loginDto = {email: 'test@test.com', password: 'wrong_password'};
            const user = {id: '1', email: loginDto.email, passwordHash: 'hashed_password'};
            const res = mockResponse();

            mockUsersService.findByEmail.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.login(res, loginDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('refreshTokens', () => {
        it('should throw UnauthorizedException if refresh token is invalid', async() => {
            const req = mockRequest();
            const res = mockResponse();
            req.cookies['refresh_token'] = 'invalid_token';

            mockJwtService.verifyAsync.mockRejectedValue(new UnauthorizedException('Invalid token'));

            await expect(service.refreshTokens(req, res)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('changePassword', () => {
        it('should change password with valid current password', async() => {
            const userId = '1';
            const changePasswordDto = {
                currentPassword: 'old_password',
                newPassword: 'new_password',
            };
            const user = {
                id: userId, 
                passwordHash: 'hashed_old_password'
            };
            const newHashedPassword = 'hashed_new_password';

            mockUsersService.findById.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true).mockResolvedValueOnce(false);
            (bcrypt.hash as jest.Mock).mockResolvedValue(newHashedPassword);
            mockUsersService.update.mockResolvedValue({});

            const result = await service.changePassword(userId, changePasswordDto);

            expect(result).toEqual({success: true});
            expect(usersService.update).toHaveBeenCalledWith(userId, {
                passwordHash: newHashedPassword,
            });
        });

        it('should throw NotFoundException if user not found', async() => {
            const userId = '999';
            const changePasswordDto = {
                currentPassword: 'old_password',
                newPassword: 'new_password',
            };

            mockUsersService.findById.mockResolvedValue(null);

            await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if current password is incorrect', async() => {
            const userId = '1';
            const changePasswordDto = {
                currentPassword: 'wrong_password',
                newPassword: 'new_password',
            };
            const user = {id: userId, passwordHash: 'hashed_old_password'};

            mockUsersService.findById.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(BadRequestException);
        });
    });
});