import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const Protected = (): CustomDecorator =>
  SetMetadata('protectionContext', true);
