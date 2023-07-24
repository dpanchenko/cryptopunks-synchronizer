import { Injectable } from '@nestjs/common';
import { CryptoTokenEntity } from '@domain/entities';
import { CryptoTokenRepository } from '@domain/repositories';
import { BlockchainAddress } from '@domain/types';

@Injectable()
export class CryptoTokenMockRepository implements CryptoTokenRepository {
  async getTokenById(
    _tokenId: string,
    _contract: BlockchainAddress,
  ): Promise<CryptoTokenEntity | null> {
    return Promise.resolve(null);
  }

  async getByOwner(
    _owner: BlockchainAddress,
    _contract: BlockchainAddress,
  ): Promise<CryptoTokenEntity[]> {
    return Promise.resolve([]);
  }

  async getList(_contract: BlockchainAddress): Promise<CryptoTokenEntity[]> {
    return Promise.resolve([]);
  }

  async save(token: CryptoTokenEntity): Promise<CryptoTokenEntity> {
    return Promise.resolve(token);
  }

  async insertList(tokens: CryptoTokenEntity[]): Promise<number> {
    return Promise.resolve(0);
  }

  async deleteAll(): Promise<number> {
    return Promise.resolve(0);
  }
}
