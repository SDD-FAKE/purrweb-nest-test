import { SwaggerThemeName } from "swagger-themes";

export type AppConfig = {
    mode: string;
    port: number;
    cookie_domain: string;
    database_url: string;
    jwt_secret: string;
    jwt_access_token_ttl: `${number}${"s"|"m"|"h"|"d"}` | number;
    jwt_refresh_token_ttl: `${number}${"s"|"m"|"h"|"d"}` | number;
    swagger_theme: SwaggerThemeName;
}
