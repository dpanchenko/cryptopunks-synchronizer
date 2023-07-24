import {
  SynchronizeTokensUseCase,
  SynchronizeTokensResponseDto,
} from '@application/use-cases';
import { CryptoTokenEntity } from '@domain/entities';
import { BlockchainService } from '@domain/services';
import { CryptoTokenRepository } from '@domain/repositories';

import { BlockchainMockService } from './mocks/services';
import { CryptoTokenMockRepository } from './mocks/repositories';

describe('SYnchronize tokens use case', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('execute succesfully', async () => {
    const blockchainService: BlockchainService = new BlockchainMockService();
    const cryptoTokenRepository: CryptoTokenRepository =
      new CryptoTokenMockRepository();
    const useCase: SynchronizeTokensUseCase = new SynchronizeTokensUseCase(
      blockchainService,
      cryptoTokenRepository,
    );
    const listOfTokens = [
      new CryptoTokenEntity({ tokenId: '1', contract: '1', owner: '1' }),
      new CryptoTokenEntity({ tokenId: '2', contract: '2', owner: '2' }),
      new CryptoTokenEntity({ tokenId: '3', contract: '3', owner: '3' }),
    ];
    const expectedResult: SynchronizeTokensResponseDto = listOfTokens.length;

    const cryptoTokenRepository_deleteAll = jest.spyOn(
      cryptoTokenRepository,
      'deleteAll',
    );
    const blockchainService_getAllTokensWithOwners = jest
      .spyOn(blockchainService, 'getAllTokensWithOwners')
      .mockResolvedValue(Promise.resolve(listOfTokens));
    const cryptoTokenRepository_insertList = jest
      .spyOn(cryptoTokenRepository, 'insertList')
      .mockResolvedValue(Promise.resolve(expectedResult));

    const useCaseResult: SynchronizeTokensResponseDto = await useCase.execute();
    expect(useCaseResult).toBeDefined();
    expect(useCaseResult).toEqual(expectedResult);
    expect(cryptoTokenRepository_deleteAll).toBeCalledTimes(1);
    expect(cryptoTokenRepository_deleteAll).toBeCalledWith();
    expect(blockchainService_getAllTokensWithOwners).toBeCalledTimes(1);
    expect(blockchainService_getAllTokensWithOwners).toBeCalledWith();
    expect(cryptoTokenRepository_insertList).toBeCalledTimes(1);
    expect(cryptoTokenRepository_insertList).toBeCalledWith(listOfTokens);
  });
});
