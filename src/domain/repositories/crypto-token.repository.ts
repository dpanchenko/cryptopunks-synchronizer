import { BlockchainAddress } from '../types';
import { CryptoTokenEntity } from '../entities';

export abstract class CryptoTokenRepository {
  abstract getTokenById(
    tokenId: string,
    contract: BlockchainAddress,
  ): Promise<CryptoTokenEntity | null>;
  abstract getByOwner(
    owner: BlockchainAddress,
    contract: BlockchainAddress,
  ): Promise<CryptoTokenEntity[]>;
  abstract getList(contract: BlockchainAddress): Promise<CryptoTokenEntity[]>;
  abstract save(token: CryptoTokenEntity): Promise<CryptoTokenEntity>;
  abstract insertList(tokens: CryptoTokenEntity[]): Promise<number>;
  abstract deleteAll(): Promise<number>;
}
