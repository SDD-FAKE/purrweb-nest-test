import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";
import { AppConfig } from "./config.interface";

export function getJwtConfig(configService: ConfigService<AppConfig>): JwtModuleOptions {
    return {
        global: true,
        secret: configService.get<string>('jwt_secret'),
        verifyOptions: {
            ignoreExpiration: false
        }
    };
}