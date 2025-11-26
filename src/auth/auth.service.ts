import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import type { Request, Response } from 'express';
import { convertUnitToMs, isDev, JwtPayload } from 'src/common';
import { ChangePasswordDto, LoginDTO, RegisterDTO } from './dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    private readonly JWT_ACCESS_TOKEN_TTL: `${number}${"s"|"m"|"h"|"d"}`|number;
    private readonly JWT_REFRESH_TOKEN_TTL: `${number}${"s"|"m"|"h"|"d"}`|number;

    private readonly COOKIE_DOMAIN: string;

    constructor(
        private readonly configService: ConfigService<AppConfig>,
        private readonly userService: UsersService,
        private jwtService: JwtService
    ) {
        this.JWT_ACCESS_TOKEN_TTL = configService.get('jwt_access_token_ttl')!;
        this.JWT_REFRESH_TOKEN_TTL = configService.get('jwt_refresh_token_ttl')!;
        this.COOKIE_DOMAIN = configService.get('cookie_domain')!;
    }

    async register(res: Response, dto: RegisterDTO) {
        const {email, password} = dto;

        if(await this.userService.userWithEmailExist(email)) {
            throw new ConflictException(`User with Email ${email} already exist`);
        }

        const user = await this.userService.create({
            email,
            passwordHash: await hash(password, 10)
        });

        return await this.auth(res, user.id)
    }

    async login(res: Response, dto: LoginDTO) {
        const {email, password} = dto;

        const user = await this.userService.findByEmail(email);

        if(!user) {
            throw new NotFoundException(`User with this email or password doesn\`t exist`);
        }

        const isValidPassword = await compare(password, user.passwordHash);

        if(!isValidPassword) {
            throw new NotFoundException(`User with this email or password doesn\`t exist`);
        }

        return await this.auth(res, user.id)
    }
        
    async refreshTokens(req: Request, res: Response) {
        const refreshToken = req.cookies['refresh_token'];

        if(!refreshToken) {
            throw new UnauthorizedException('Refresh-token is invalid');
        }

        try {
            const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

            const user = await this.userService.findById(payload.id);

            if(!user) {
                throw new NotFoundException('User doesn`t exist');
            }

            return this.auth(res, user.id);
        } catch {
            throw new UnauthorizedException('Refresh-token is invalid');
        }
    }

    async logout(res: Response) {
        this.setCookie(res, 'refreshToken', new Date(0));

        return {success: true};
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const user = await this.userService.findById(userId);

        if(!user) {
            throw new NotFoundException('User not found');
        }

        const isValidCurrentPassword = await compare(dto.currentPassword, user.passwordHash);

        if(!isValidCurrentPassword) {
            throw new BadRequestException('Current password is incorrect');
        }

        const isSamePassword = await compare(dto.newPassword, user.passwordHash);
        if(isSamePassword) {
            throw new ConflictException('New password must be different from current password');
        }

        const newPasswordHash = await hash(dto.newPassword, 10);

        await this.userService.update(userId, {
            passwordHash: newPasswordHash
        });

        return {success: true};
    }

    async deleteAccount(userId: string, res: Response) {
        await this.userService.delete(userId);

        this.setCookie(res, 'refreshToken', new Date(0));

        return {success: true};
    }

    async validate(id: string) {
        const user = await this.userService.findById(id);

        if(!user) {
            return null;
        }

        return user;
    }

    private async auth(res: Response, id: string) {
        const {accessToken, refreshToken} = await this.generateTokens(id);

        this.setCookie(res, refreshToken, new Date(Date.now() + convertUnitToMs(this.JWT_REFRESH_TOKEN_TTL)));

        return {accessToken};
    }

    private async generateTokens(id: string) {
        const payload: JwtPayload = {id};

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: this.JWT_ACCESS_TOKEN_TTL,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: this.JWT_REFRESH_TOKEN_TTL,
        });

        return {
            accessToken, refreshToken
        };
    }

    private setCookie(res: Response, value: string, expires: Date) {
        res.cookie('refresh_token', value, {
            httpOnly: true,
            domain: this.COOKIE_DOMAIN,
            expires,
            secure: !isDev(this.configService),
            sameSite: isDev(this.configService) ? 'none' : 'lax',
        });
    }
}
