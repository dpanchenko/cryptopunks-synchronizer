import { IsBoolean, IsString } from 'class-validator';

export interface IAuthConfig {
  authTokenSecret: string;
  authTokenExpiration: string;
  authRefreshTokenSecret: string;
  authRefreshTokenExpiration: string;
  otpEmulationMode: boolean;
}

export class AuthConfigValidator implements IAuthConfig {
  @IsString()
  readonly authTokenSecret!: string;

  @IsString()
  readonly authTokenExpiration!: string;

  @IsString()
  readonly authRefreshTokenSecret!: string;

  @IsString()
  readonly authRefreshTokenExpiration!: string;

  @IsBoolean()
  readonly otpEmulationMode!: boolean;
}

export const getAuthConfig = (): IAuthConfig => ({
  authTokenSecret: process.env.AUTH_TOKEN_SECRET as string,
  authTokenExpiration: process.env.AUTH_TOKEN_EXPIRATION as string,
  authRefreshTokenSecret: process.env.AUTH_REFRESH_TOKEN_SECRET as string,
  authRefreshTokenExpiration: process.env
    .AUTH_REFRESH_TOKEN_EXPIRATION as string,
  otpEmulationMode: process.env.OTP_EMULATION_MODE === 'true',
});
