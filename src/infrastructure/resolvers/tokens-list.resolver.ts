import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { GetTokensArgs } from './dto';
import { CryptoTokenModel } from './models';
import { AuthGuard } from '../guards';
import { Protected } from '../decorators';

import { GetCryptoTokensListUseCase } from '@application/use-cases';
import { IBlockchainConfig } from '@config/index';
import { ICryptoToken } from '@domain/types';

@Resolver()
@UseGuards(AuthGuard)
export class TokensListResolver {
  private readonly blockchainConfig: IBlockchainConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly getCryptoTokensListUseCase: GetCryptoTokensListUseCase,
  ) {
    this.blockchainConfig =
      this.configService.get<IBlockchainConfig>('blockchain');
  }

  @Query((returns) => [CryptoTokenModel], { name: 'TokensList' })
  @Protected()
  async execute(
    @Args() getTokensArgs: GetTokensArgs,
  ): Promise<CryptoTokenModel[]> {
    const { owner } = getTokensArgs;
    const cryptoTokenData = (await this.getCryptoTokensListUseCase.execute({
      owner,
      contract: this.blockchainConfig.tokenContractAddress,
    })) as Required<ICryptoToken>[];

    return cryptoTokenData;
  }
}
