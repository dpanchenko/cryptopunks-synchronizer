import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RefreshAuthTokenArgs } from './dto';
import { AuthTokenPairModel } from './models';

import { RefreshTokensUseCase } from '@application/use-cases';

@Resolver()
export class RefreshAuthTokenResolver {
  constructor(private readonly refreshTokensUseCase: RefreshTokensUseCase) {}

  @Mutation((returns) => AuthTokenPairModel, { name: 'RefreshAuthToken' })
  async execute(
    @Args() refreshAuthTokenArgs: RefreshAuthTokenArgs,
  ): Promise<AuthTokenPairModel> {
    const { token } = refreshAuthTokenArgs;

    return this.refreshTokensUseCase.execute({ token });
  }
}
