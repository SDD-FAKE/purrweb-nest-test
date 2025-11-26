import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;

    const mockAuthService = {
        register: jest.fn(),
        login: jest.fn(),
        refreshTokens: jest.fn(),
        logout: jest.fn(),
        changePassword: jest.fn(),
        deleteAccount: jest.fn(),
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
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a user', async() => {
            const registerDto = {email: 'test@test.com', password: 'password123'};
            const expectedResult = {accessToken: 'token'};
            const res = mockResponse();

            mockAuthService.register.mockResolvedValue(expectedResult);

            const result = await controller.register(res, registerDto);

            expect(result).toEqual(expectedResult);
            expect(mockAuthService.register).toHaveBeenCalledWith(res, registerDto);
        });
    });

    describe('login', () => {
        it('should login user', async () => {
            const loginDto = { email: 'test@test.com', password: 'password123' };
            const expectedResult = { accessToken: 'token' };
            const res = mockResponse();

            mockAuthService.login.mockResolvedValue(expectedResult);

            const result = await controller.login(res, loginDto);

            expect(result).toEqual(expectedResult);
            expect(mockAuthService.login).toHaveBeenCalledWith(res, loginDto);
        });
    });

    describe('refresh', () => {
        it('should refresh tokens', async() => {
            const expectedResult = {accessToken: 'new_token'};
            const req = mockRequest();
            const res = mockResponse();

            mockAuthService.refreshTokens.mockResolvedValue(expectedResult);

            const result = await controller.refresh(req, res);

            expect(result).toEqual(expectedResult);
            expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(req, res);
        });
    });

    describe('logout', () => {
        it('should logout user', async() => {
            const expectedResult = {success: true};
            const res = mockResponse();

            mockAuthService.logout.mockResolvedValue(expectedResult);

            const result = await controller.logout(res);

            expect(result).toEqual(expectedResult);
            expect(mockAuthService.logout).toHaveBeenCalledWith(res);
        });
    });

    describe('changePassword', () => {
        it('should change password', async() => {
            const userId = '1';
            const changePasswordDto = {
                currentPassword: 'old_password',
                newPassword: 'new_password',
            };
            const expectedResult = {success: true};

            mockAuthService.changePassword.mockResolvedValue(expectedResult);

            const result = await controller.changePassword(userId, changePasswordDto);

            expect(result).toEqual(expectedResult);
            expect(mockAuthService.changePassword).toHaveBeenCalledWith(userId, changePasswordDto);
        });
    });

    describe('deleteAccount', () => {
        it('should delete account', async() => {
            const userId = '1';
            const expectedResult = {success: true};
            const res = mockResponse();

            mockAuthService.deleteAccount.mockResolvedValue(expectedResult);

            const result = await controller.deleteAccount(userId, res);

            expect(result).toEqual(expectedResult);
            expect(mockAuthService.deleteAccount).toHaveBeenCalledWith(userId, res);
        });
    });
});