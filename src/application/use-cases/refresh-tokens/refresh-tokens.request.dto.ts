import { AuthToken } from '@domain/types';

export interface RefreshTokensRequestDto {
  token: AuthToken;
}
