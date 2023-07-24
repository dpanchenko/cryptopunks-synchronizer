import { BlockchainService } from '@domain/services';
import { CryptoTokenRepository } from '@domain/repositories';

import { SynchronizeTokensResponseDto } from './syncronize-tokens.response.dto';

export class SynchronizeTokensUseCase {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly cryptoTokenRepository: CryptoTokenRepository,
  ) {}

  async execute(): Promise<SynchronizeTokensResponseDto> {
    await this.cryptoTokenRepository.deleteAll();

    const cryptoTokenEntities =
      await this.blockchainService.getAllTokensWithOwners();

    return await this.cryptoTokenRepository.insertList(cryptoTokenEntities);
  }
}
