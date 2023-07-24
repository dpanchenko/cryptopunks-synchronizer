import { BlockchainAddress } from '@domain/types';

export interface GetCryptoTokensListRequestDto {
  owner?: BlockchainAddress;
  contract: BlockchainAddress;
}
