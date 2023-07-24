import { BlockchainAddress, ICryptoToken } from '../types';

export class CryptoTokenEntity implements ICryptoToken {
  public tokenId: string;

  public contract: BlockchainAddress;

  public owner: BlockchainAddress;

  public createdAt: Date;

  public updatedAt: Date | null;

  constructor(params: ICryptoToken) {
    this.tokenId = params.tokenId;
    this.contract = params.contract;
    this.owner = params.owner;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? null;
  }

  toJSON(): ICryptoToken {
    return {
      tokenId: this.tokenId,
      contract: this.contract,
      owner: this.owner,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
