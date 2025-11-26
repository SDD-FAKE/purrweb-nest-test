import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, validateSync } from 'class-validator';
import { SwaggerThemeName, SwaggerThemeNameEnum } from 'swagger-themes';

export enum Environment {
    Development = 'development',
    Production = 'production',
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNumber()
    @Min(1)
    PORT: number;

    @IsString()
    @IsNotEmpty()
    COOKIE_DOMAIN: string;

    @IsString()
    @IsNotEmpty()
    DATABASE_URL: string;

    @IsString()
    @IsNotEmpty()
    JWT_SECRET: string;

    @IsString()
    @IsNotEmpty()
    JWT_ACCESS_TOKEN_TTL: string;

    @IsString()
    @IsNotEmpty()
    JWT_REFRESH_TOKEN_TTL: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(SwaggerThemeNameEnum)
    SWAGGER_THEME: SwaggerThemeName;
}

export function validateEnv(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        {enableImplicitConversion: true},
    );
    const errors = validateSync(validatedConfig, {skipMissingProperties: false});

    if(errors.length > 0) {
        throw new Error(
            `.env validation errors: ${errors.map(er => 
                er.constraints ? er.constraints[Object.keys(er.constraints!)[0]] : er.toString()
            ).join(';\n')}`
        );
    }

    return validatedConfig;
}
