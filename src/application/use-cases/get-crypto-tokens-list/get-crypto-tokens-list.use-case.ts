import { CryptoTokenRepository } from '@domain/repositories';

import { GetCryptoTokensListRequestDto } from './get-crypto-tokens-list.request.dto';
import { GetCryptoTokensListResponseDto } from './get-crypto-tokens-list.response.dto';

export class GetCryptoTokensListUseCase {
  constructor(private readonly cryptoTokenRepository: CryptoTokenRepository) {}

  async execute(
    params: GetCryptoTokensListRequestDto,
  ): Promise<GetCryptoTokensListResponseDto> {
    const { owner, contract } = params;

    const cryptoTokenEntities = owner
      ? await this.cryptoTokenRepository.getByOwner(owner, contract)
      : await this.cryptoTokenRepository.getList(contract);

    return cryptoTokenEntities.map((cryptoTokenEntity) =>
      cryptoTokenEntity.toJSON(),
    );
  }
}
