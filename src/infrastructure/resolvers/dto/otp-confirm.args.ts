import { ArgsType, Field } from '@nestjs/graphql';
import { IsNumberString, IsUUID } from 'class-validator';

@ArgsType()
export class OtpConfirmArgs {
  @Field((type) => String)
  @IsNumberString()
  otpCode: string;

  @Field((type) => String)
  @IsUUID()
  otpReference: string;
}
