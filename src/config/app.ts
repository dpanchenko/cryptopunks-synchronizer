import { IsInt, IsOptional, IsString } from 'class-validator';
import * as process from 'process';

export interface IAppConfig {
  env?: string;
  port: number;
  emailTemplatesPath?: string;
}

export class AppConfigValidator implements IAppConfig {
  @IsOptional()
  @IsString()
  readonly env?: string;

  @IsInt()
  readonly port!: number;

  @IsOptional()
  @IsString()
  readonly emailTemplatesPath?: string;
}

export const getAppConfig = (): IAppConfig => ({
  env: process.env.NODE_ENV ?? 'local',
  port: parseInt(`${process.env.PORT || 3333}`, 10),
  emailTemplatesPath:
    process.env.EMAIL_TEMPLATES_PATH ?? 'src/infrastructure/templates',
});
