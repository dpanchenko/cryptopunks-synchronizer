import { Injectable } from '@nestjs/common';
import { CryptoTokenEntity } from '@domain/entities';
import { BlockchainService } from '@domain/services';
import { BlockchainTransferListener } from '@domain/types';

@Injectable()
export class BlockchainMockService implements BlockchainService {
  async getAllTokensWithOwners(): Promise<CryptoTokenEntity[]> {
    return Promise.resolve([]);
  }

  subscribeOnTransferEvents(_listener: BlockchainTransferListener): void {
    return;
  }
}
