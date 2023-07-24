import { AuthToken } from './auth-token.type';

export interface IAuthTokensPair {
  accessToken: AuthToken;
  refreshToken: AuthToken;
}
