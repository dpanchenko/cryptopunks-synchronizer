import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class LoginArgs {
  @Field((type) => String)
  @IsEmail()
  email: string;
}
