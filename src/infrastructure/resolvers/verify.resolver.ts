import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OtpConfirmArgs } from './dto';
import { AuthTokenPairModel } from './models';

import { OtpConfirmUseCase } from '@application/use-cases';

@Resolver((of) => AuthTokenPairModel)
export class VerifyResolver {
  constructor(private readonly otpConfirmUseCase: OtpConfirmUseCase) {}

  @Mutation((returns) => AuthTokenPairModel, { name: 'VerifyOtp' })
  async execute(
    @Args() otpConfirmArgs: OtpConfirmArgs,
  ): Promise<AuthTokenPairModel> {
    const { otpCode, otpReference } = otpConfirmArgs;

    return this.otpConfirmUseCase.execute({ otpCode, otpReference });
  }
}
