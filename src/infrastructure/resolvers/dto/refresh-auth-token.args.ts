import { ArgsType, Field } from '@nestjs/graphql';
import { IsJWT } from 'class-validator';

@ArgsType()
export class RefreshAuthTokenArgs {
  @Field((type) => String)
  @IsJWT()
  token: string;
}
