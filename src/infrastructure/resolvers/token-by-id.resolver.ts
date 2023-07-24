import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { CryptoTokenModel } from './models';
import { AuthGuard } from '../guards';
import { Protected } from '../decorators';

import { GetCryptoTokenByIdUseCase } from '@application/use-cases';
import { IBlockchainConfig } from '@config/index';
import { ICryptoToken } from '@domain/types';

@Resolver()
@UseGuards(AuthGuard)
export class TokenByIdResolver {
  private readonly blockchainConfig: IBlockchainConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly getCryptoTokenByIdUseCase: GetCryptoTokenByIdUseCase,
  ) {
    this.blockchainConfig =
      this.configService.get<IBlockchainConfig>('blockchain');
  }

  @Query((returns) => CryptoTokenModel, { name: 'TokenById' })
  @Protected()
  async execute(@Args('tokenId') tokenId: string): Promise<CryptoTokenModel> {
    const cryptoTokenData = (await this.getCryptoTokenByIdUseCase.execute({
      tokenId,
      contract: this.blockchainConfig.tokenContractAddress,
    })) as Required<ICryptoToken>;

    return cryptoTokenData;
  }
}
