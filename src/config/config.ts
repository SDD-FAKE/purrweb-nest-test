import "dotenv/config";
import { AppConfig } from "./config.interface";
import { SwaggerThemeName } from "swagger-themes";

export default (): AppConfig => ({
    mode: process.env.NODE_ENV as string,
    port: parseInt(process.env.PORT!, 10),
    cookie_domain: process.env.COOKIE_DOMAIN as string,
    database_url: process.env.DATABASE_URL as string,
    jwt_secret: process.env.JWT_SECRET as string,
    jwt_access_token_ttl: process.env.JWT_ACCESS_TOKEN_TTL as `${number}${"s"|"m"|"h"|"d"}` | number,
    jwt_refresh_token_ttl: process.env.JWT_REFRESH_TOKEN_TTL as `${number}${"s"|"m"|"h"|"d"}` | number,
    swagger_theme: process.env.SWAGGER_THEME as SwaggerThemeName,
});