import { IsInt, IsString } from 'class-validator';
import * as process from 'process';

export interface IBlockchainConfig {
  nodeRpc: string;
  tokenContractAddress: string;
  multicallContractAddress: string;
  multicallLimit?: number;
}

export class BlockchainConfigValidator implements IBlockchainConfig {
  @IsString()
  readonly nodeRpc!: string;

  @IsString()
  readonly tokenContractAddress!: string;

  @IsString()
  readonly multicallContractAddress!: string;

  @IsInt()
  readonly multicallLimit!: number;
}

export const getBlockchainConfig = (): IBlockchainConfig => ({
  nodeRpc: process.env.BLOCKCHAIN_NODE_RPC,
  tokenContractAddress: process.env.BLOCKCHAIN_TOKEN_CONTRACT,
  multicallContractAddress: process.env.BLOCKCHAIN_MULTICALL_CONTRACT,
  multicallLimit: parseInt(
    `${process.env.BLOCKCHAIN_MULTICALL_LIMIT || 500}`,
    10,
  ),
});
