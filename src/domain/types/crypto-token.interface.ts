import { BlockchainAddress } from './blockchain-address.type';

export interface ICryptoToken {
  tokenId: string;
  contract: BlockchainAddress;
  owner: BlockchainAddress;
  createdAt?: Date;
  updatedAt?: Date | null;
}
