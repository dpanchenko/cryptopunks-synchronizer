import { Injectable } from '@nestjs/common';
import { AuthTokenService } from '@domain/services';
import { IAuthTokensPair, AuthToken, IAuthTokenPayload } from '@domain/types';

@Injectable()
export class AuthTokenMockService implements AuthTokenService {
  async generateAuthToken(_email: string): Promise<IAuthTokensPair> {
    return Promise.resolve({
      accessToken: '',
      refreshToken: '',
    });
  }

  async verifyAuthToken(_token: AuthToken): Promise<IAuthTokenPayload> {
    return Promise.resolve({
      email: '',
    });
  }

  async verifyRefreshToken(_token: AuthToken): Promise<IAuthTokenPayload> {
    return Promise.resolve({
      email: '',
    });
  }
}
