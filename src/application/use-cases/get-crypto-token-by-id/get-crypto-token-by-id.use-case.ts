import { CryptoTokenNotFoundError } from '@domain/errors';
import { CryptoTokenRepository } from '@domain/repositories';

import { GetCryptoTokenByIdRequestDto } from './get-crypto-token-by-id.request.dto';
import { GetCryptoTokenByIdResponseDto } from './get-crypto-token-by-id.response.dto';

export class GetCryptoTokenByIdUseCase {
  constructor(private readonly cryptoTokenRepository: CryptoTokenRepository) {}

  async execute(
    params: GetCryptoTokenByIdRequestDto,
  ): Promise<GetCryptoTokenByIdResponseDto> {
    const { tokenId, contract } = params;

    const cryptoTokenEntity = await this.cryptoTokenRepository.getTokenById(
      tokenId,
      contract,
    );

    if (!cryptoTokenEntity) {
      throw new CryptoTokenNotFoundError(
        `Token ${tokenId} on contract ${contract}`,
      );
    }

    return cryptoTokenEntity.toJSON();
  }
}
