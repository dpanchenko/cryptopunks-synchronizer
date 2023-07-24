import { AuthToken } from '../types';

export abstract class AuthTokensBlacklistRepository {
  abstract checkToken(token: AuthToken): Promise<boolean>;
  abstract saveToken(token: AuthToken): Promise<void>;
}
