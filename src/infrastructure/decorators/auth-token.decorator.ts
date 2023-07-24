import { createParamDecorator } from '@nestjs/common';

import { IAuthRequest } from '../types';

export const AuthToken = createParamDecorator((data, ctx) => {
  const request: IAuthRequest = ctx.switchToHttp().getRequest();

  return request.authToken;
});
