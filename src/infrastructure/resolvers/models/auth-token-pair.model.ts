import { Field, ObjectType } from '@nestjs/graphql';
import { IAuthTokensPair } from '@domain/types';

@ObjectType({ description: 'Auth token pair model' })
export class AuthTokenPairModel implements IAuthTokensPair {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
