import { Multicall } from 'ethereum-multicall';
import { ethers, JsonRpcProvider, Contract } from 'ethers';

import { IBlockchainConfig } from '@config/index';
import { CRYPTOPUNKS_TOKEN_ABI } from './cryptopunks-token-abi';

export class EthersProvider {
  private provider: JsonRpcProvider;
  private multicall: Multicall;
  private contract: Contract;

  constructor(private readonly blockchainConfig: IBlockchainConfig) {
    this.provider = new ethers.JsonRpcProvider(blockchainConfig.nodeRpc);
    this.multicall = new Multicall({
      nodeUrl: blockchainConfig.nodeRpc,
      tryAggregate: true,
      multicallCustomContractAddress: blockchainConfig.multicallContractAddress,
    });
    this.provider = new ethers.JsonRpcProvider(blockchainConfig.nodeRpc);
    this.contract = new ethers.Contract(
      blockchainConfig.tokenContractAddress,
      CRYPTOPUNKS_TOKEN_ABI,
      {
        provider: this.provider,
      },
    );
  }

  public getProvider(): JsonRpcProvider {
    return this.provider;
  }

  public getMulticall(): Multicall {
    return this.multicall;
  }

  public getContract(): Contract {
    return this.contract;
  }
}
