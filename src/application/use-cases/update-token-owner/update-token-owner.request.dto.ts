import { BlockchainAddress } from '@domain/types';

export interface UpdateTokenOwnerRequestDto {
  contract: BlockchainAddress;
  tokenId: string;
  owner: BlockchainAddress;
}
