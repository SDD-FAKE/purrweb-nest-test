import { ConfigService } from "@nestjs/config";
import { AppConfig } from "src/config/config.interface";
import { Environment } from "src/config/env.validation";

export const isDev = (configService: ConfigService<AppConfig>) => configService.get('mode') == Environment.Development;