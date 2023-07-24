import { Request } from 'express';

import { AuthToken } from '@domain/types';

export interface IAuthRequest extends Request {
  email?: string;
  authToken?: AuthToken;
}
