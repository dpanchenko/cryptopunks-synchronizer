import { IAuthTokensPair, AuthToken, IAuthTokenPayload } from '../types';

export abstract class AuthTokenService {
  abstract generateAuthToken(email: string): Promise<IAuthTokensPair>;
  abstract verifyAuthToken(token: AuthToken): Promise<IAuthTokenPayload>;
  abstract verifyRefreshToken(token: AuthToken): Promise<IAuthTokenPayload>;
}
