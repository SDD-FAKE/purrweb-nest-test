
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/config.interface';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        configService: ConfigService<AppConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('jwt_secret'),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.authService.validate(payload.id);

        if(!user) {
            throw new UnauthorizedException("User is not authenticated");
        }

        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
}
