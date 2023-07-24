import { BlockchainAddress } from '@domain/types';

export interface GetCryptoTokenByIdRequestDto {
  tokenId: string;
  contract: BlockchainAddress;
}
