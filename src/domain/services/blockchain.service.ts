import { CryptoTokenEntity } from '../entities';
import { BlockchainTransferListener } from '../types';

export abstract class BlockchainService {
  abstract getAllTokensWithOwners(): Promise<CryptoTokenEntity[]>;
  abstract subscribeOnTransferEvents(
    listener: BlockchainTransferListener,
  ): void;
}
