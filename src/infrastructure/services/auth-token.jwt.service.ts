import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { IAuthConfig } from '@config/index';
import { AuthTokenService } from '@domain/services';
import { IAuthTokensPair, AuthToken, IAuthTokenPayload } from '@domain/types';

@Injectable()
export class AuthTokenJwtService implements AuthTokenService {
  private readonly logger: Logger = new Logger(AuthTokenJwtService.name);
  private readonly authConfig: IAuthConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.authConfig = this.configService.get('auth') as IAuthConfig;
  }

  async generateAuthToken(email: string): Promise<IAuthTokensPair> {
    this.logger.verbose(`Generate token for email ${email}`);

    const accessToken = await this.jwtService.signAsync(
      {
        email,
      },
      {
        secret: this.authConfig.authTokenSecret,
        expiresIn: this.authConfig.authTokenExpiration,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        email,
      },
      {
        secret: this.authConfig.authRefreshTokenSecret,
        expiresIn: this.authConfig.authRefreshTokenExpiration,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAuthToken(token: AuthToken): Promise<IAuthTokenPayload> {
    this.logger.verbose(`Verify auth token ${token}`);

    const decodedToken = await this.jwtService.verifyAsync<IAuthTokenPayload>(
      token,
      {
        secret: this.authConfig.authTokenSecret,
      },
    );

    return {
      email: decodedToken.email,
    };
  }

  async verifyRefreshToken(token: AuthToken): Promise<IAuthTokenPayload> {
    this.logger.verbose(`Verify refresh token ${token}`);

    const decodedToken = await this.jwtService.verifyAsync<IAuthTokenPayload>(
      token,
      {
        secret: this.authConfig.authRefreshTokenSecret,
      },
    );

    if (!decodedToken) {
      return null;
    }

    return {
      email: decodedToken.email,
    };
  }
}
