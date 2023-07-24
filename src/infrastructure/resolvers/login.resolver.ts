import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginArgs } from './dto';
import { LoginModel } from './models';

import { LoginUseCase } from '@application/use-cases';

@Resolver()
export class LoginResolver {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Mutation((returns) => LoginModel, { name: 'Login' })
  async execute(@Args() loginArgs: LoginArgs): Promise<LoginModel> {
    const { email } = loginArgs;

    return this.loginUseCase.execute({ email });
  }
}
