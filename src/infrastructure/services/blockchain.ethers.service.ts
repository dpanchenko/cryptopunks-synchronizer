import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ContractError } from '@domain/errors';
import { CryptoTokenEntity } from '@domain/entities';
import { BlockchainService } from '@domain/services';
import {
  ETHERS_PROVIDER_TOKEN,
  EthersProvider,
  CRYPTOPUNKS_TOKEN_ABI,
} from '@libs/providers';
import { IBlockchainConfig } from '@config/blockchain';
import { BlockchainAddress, BlockchainTransferListener } from '@domain/types';

@Injectable()
export class BlockchainEthersService implements BlockchainService {
  readonly logger: Logger = new Logger(BlockchainEthersService.name);
  private readonly blockchainConfig: IBlockchainConfig;

  constructor(
    @Inject(ETHERS_PROVIDER_TOKEN)
    private readonly ethersProvider: EthersProvider,
    private readonly configService: ConfigService,
  ) {
    this.blockchainConfig =
      this.configService.get<IBlockchainConfig>('blockchain');
  }

  private getOwnerContractCall(punkIndex: number) {
    return {
      reference: `punkIndexToAddressCall${punkIndex}`,
      methodName: 'punkIndexToAddress',
      methodParameters: [punkIndex],
    };
  }

  private parseContractCallResults(
    callResults: ContractCallResults,
    callName: string,
  ): Record<string, string> {
    let failedCallsCount = 0;

    const result: Record<string, string> = callResults.results[
      callName
    ]?.callsReturnContext?.reduce((acc, curr) => {
      if (curr.success) {
        const punkIndex = curr.methodParameters[0];
        const ownerAddress = curr.returnValues[0];

        if (punkIndex) {
          return {
            ...acc,
            [punkIndex]: ownerAddress,
          };
        }
      } else {
        failedCallsCount++;
      }

      return acc;
    }, {});

    this.logger.debug(`Failed calls count: ${failedCallsCount}`);
    return result;
  }

  async getAllTokensWithOwners(): Promise<CryptoTokenEntity[]> {
    this.logger.debug(`Syncronize all tokens owners`);

    const contract = this.ethersProvider.getContract();

    if (!contract.totalSupply || !contract.punkIndexToAddress) {
      this.logger.debug(
        `Contract don't support "totalSupply" or "punkIndexToAddress" fragments`,
      );

      throw new ContractError(
        `Contract don't support "totalSupply" or "punkIndexToAddress" fragments`,
      );
    }

    const totalSupply = await contract.totalSupply();

    this.logger.debug(`Total supplied tokens: ${totalSupply}`);

    const multicall = this.ethersProvider.getMulticall();
    const indexToAddressAbi = CRYPTOPUNKS_TOKEN_ABI.find(
      (item) => item.name === 'punkIndexToAddress',
    );

    if (!indexToAddressAbi) {
      throw new ContractError(
        `Missing "punkIndexToAddress" fragment in contract abi`,
      );
    }

    const callReference = 'contcryptopunksContract';
    const callContext: ContractCallContext[] = [
      {
        reference: callReference,
        contractAddress: this.blockchainConfig.tokenContractAddress,
        abi: [indexToAddressAbi],
        calls: [],
      },
    ];

    let punkOwners: Record<string, string> = {};

    for (let i = 1; i <= totalSupply; i++) {
      if (i % 5000 === 0) {
        const callResults: ContractCallResults = await multicall.call(
          callContext,
        );

        punkOwners = {
          ...punkOwners,
          ...this.parseContractCallResults(callResults, callReference),
        };

        callContext[0].calls = [];
      }

      callContext[0].calls.push(this.getOwnerContractCall(i));
    }

    return Object.keys(punkOwners).map(
      (punkIndex) =>
        new CryptoTokenEntity({
          tokenId: punkIndex,
          contract: this.blockchainConfig.tokenContractAddress,
          owner: punkOwners[punkIndex],
        }),
    );
  }

  subscribeOnTransferEvents(listener: BlockchainTransferListener): void {
    this.logger.debug(`Subscribe on "PunkTransfer" events`);

    const contract = this.ethersProvider.getContract();
    contract.on(
      'PunkTransfer',
      (from: BlockchainAddress, to: BlockchainAddress, punkIndex: number) => {
        this.logger.debug(
          `Got "PunkTransfer" event from ${from}, to ${to}, punkIndex ${punkIndex}`,
        );

        listener(
          this.blockchainConfig.tokenContractAddress,
          `${punkIndex}`,
          to,
        );
      },
    );
  }
}
