import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class GetTokensArgs {
  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  owner?: string;
}
