import { CryptoTokenRepository } from '@domain/repositories';

import { UpdateTokenOwnerRequestDto } from './update-token-owner.request.dto';
import { UpdateTokenOwnerResponseDto } from './update-token-owner.response.dto';
import { CryptoTokenEntity } from '@domain/entities';

export class UpdateTokenOwnerUseCase {
  constructor(private readonly cryptoTokenRepository: CryptoTokenRepository) {}

  async execute(
    params: UpdateTokenOwnerRequestDto,
  ): Promise<UpdateTokenOwnerResponseDto> {
    const { contract, tokenId, owner } = params;

    let cryptoTokenEntity = await this.cryptoTokenRepository.getTokenById(
      tokenId,
      contract,
    );

    if (!cryptoTokenEntity) {
      cryptoTokenEntity = new CryptoTokenEntity({
        tokenId,
        contract,
        owner,
      });
    } else {
      cryptoTokenEntity.owner = owner;
    }

    await this.cryptoTokenRepository.save(cryptoTokenEntity);

    return {
      token: cryptoTokenEntity.toJSON(),
    };
  }
}
