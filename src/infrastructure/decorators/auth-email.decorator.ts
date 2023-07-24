import { createParamDecorator } from '@nestjs/common';

import { IAuthRequest } from '../types';

export const AuthEmail = createParamDecorator((_, ctx) => {
  const request: IAuthRequest = ctx.switchToHttp().getRequest();

  return request.email;
});
