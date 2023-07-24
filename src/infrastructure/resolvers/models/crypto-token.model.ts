import { Field, ObjectType } from '@nestjs/graphql';
import { ICryptoToken } from '@domain/types';

@ObjectType({ description: 'Crypto token model' })
export class CryptoTokenModel implements Required<ICryptoToken> {
  @Field()
  tokenId: string;

  @Field()
  contract: string;

  @Field()
  owner: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date | null;
}
