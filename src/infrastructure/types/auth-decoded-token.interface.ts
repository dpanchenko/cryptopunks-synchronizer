import { IAuthTokenPayload } from '@domain/types';

export interface IAuthDecodedToken extends IAuthTokenPayload {
  iat: number;
  exp: number;
}
