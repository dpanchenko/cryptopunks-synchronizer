import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Login model' })
export class LoginModel {
  @Field()
  otpReference: string;
}
