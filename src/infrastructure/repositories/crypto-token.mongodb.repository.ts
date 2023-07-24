import { Inject, Injectable, Logger } from '@nestjs/common';
import { Collection } from 'mongodb';
import { CryptoTokenEntity } from '@domain/entities';
import { CryptoTokenRepository } from '@domain/repositories';
import { BlockchainAddress, ICryptoToken } from '@domain/types';
import { MONGODB_PROVIDER_TOKEN, MongodbProvider } from '@libs/providers';

@Injectable()
export class CryptoTokenMongodbRepository implements CryptoTokenRepository {
  private readonly logger: Logger = new Logger(
    CryptoTokenMongodbRepository.name,
  );
  private readonly cryptoTokenCollection: Collection<ICryptoToken>;

  constructor(
    @Inject(MONGODB_PROVIDER_TOKEN)
    private readonly mongodbProvider: MongodbProvider,
  ) {
    this.cryptoTokenCollection = this.mongodbProvider
      .getDb()
      .collection<ICryptoToken>('crypto-tokens');

    this.cryptoTokenCollection.createIndex({
      contract: 1,
      tokenId: 1,
    });
  }

  async getTokenById(
    tokenId: string,
    contract: BlockchainAddress,
  ): Promise<CryptoTokenEntity | null> {
    const cryptoTokenData =
      await this.cryptoTokenCollection.findOne<ICryptoToken>({
        contract,
        tokenId,
      });

    return cryptoTokenData ? new CryptoTokenEntity(cryptoTokenData) : null;
  }
  private async getListBy(
    props: Record<string, string>,
  ): Promise<CryptoTokenEntity[]> {
    const cryptoTokensCursor =
      this.cryptoTokenCollection.find<ICryptoToken>(props);
    const cryptoTokensList = await cryptoTokensCursor.toArray();

    return cryptoTokensList.map(
      (cryptoTokenData) => new CryptoTokenEntity(cryptoTokenData),
    );
  }

  async getByOwner(
    owner: BlockchainAddress,
    contract: BlockchainAddress,
  ): Promise<CryptoTokenEntity[]> {
    return this.getListBy({
      contract,
      owner,
    });
  }

  async getList(contract: BlockchainAddress): Promise<CryptoTokenEntity[]> {
    return this.getListBy({
      contract,
    });
  }

  async save(token: CryptoTokenEntity): Promise<CryptoTokenEntity> {
    token.updatedAt = new Date();

    const cryptoTokenData = token.toJSON();

    await this.cryptoTokenCollection.updateOne(
      {
        contract: cryptoTokenData.contract,
        tokenId: cryptoTokenData.tokenId,
      },
      {
        $set: cryptoTokenData,
      },
      {
        upsert: true,
      },
    );

    return token;
  }

  async insertList(tokens: CryptoTokenEntity[]): Promise<number> {
    const result = await this.cryptoTokenCollection.insertMany(
      tokens.map((token) => token.toJSON()),
    );

    return result.insertedCount;
  }

  async deleteAll(): Promise<number> {
    const result = await this.cryptoTokenCollection.deleteMany();

    return result.deletedCount;
  }
}
