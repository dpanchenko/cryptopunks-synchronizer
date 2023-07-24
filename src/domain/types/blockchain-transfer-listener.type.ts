import { BlockchainAddress } from './blockchain-address.type';

export type BlockchainTransferListener = (
  contract: BlockchainAddress,
  tokenId: string,
  owner: BlockchainAddress,
) => void;
