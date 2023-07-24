import {
  GetCryptoTokensListUseCase,
  GetCryptoTokensListRequestDto,
  GetCryptoTokensListResponseDto,
} from '@application/use-cases';
import { CryptoTokenEntity } from '@domain/entities';
import { CryptoTokenRepository } from '@domain/repositories';

import { CryptoTokenMockRepository } from './mocks/repositories';

describe('Get tokens list use case', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('execute succesfully with owner param', async () => {
    const cryptoTokenRepository: CryptoTokenRepository =
      new CryptoTokenMockRepository();
    const useCase: GetCryptoTokensListUseCase = new GetCryptoTokensListUseCase(
      cryptoTokenRepository,
    );
    const listOfTokens = [
      new CryptoTokenEntity({ tokenId: '1', contract: '1', owner: '1' }),
      new CryptoTokenEntity({ tokenId: '2', contract: '2', owner: '2' }),
      new CryptoTokenEntity({ tokenId: '3', contract: '3', owner: '3' }),
    ];
    const useCaseParams: GetCryptoTokensListRequestDto = {
      contract: '1',
      owner: '1',
    };
    const expectedResult: GetCryptoTokensListResponseDto = listOfTokens.map(
      (token) => token.toJSON(),
    );

    const cryptoTokenRepository_getList = jest
      .spyOn(cryptoTokenRepository, 'getList')
      .mockResolvedValue(Promise.resolve(listOfTokens));
    const cryptoTokenRepository_getByOwner = jest
      .spyOn(cryptoTokenRepository, 'getByOwner')
      .mockResolvedValue(Promise.resolve(listOfTokens));

    const useCaseResult: GetCryptoTokensListResponseDto = await useCase.execute(
      useCaseParams,
    );
    expect(useCaseResult).toBeDefined();
    expect(useCaseResult).toEqual(expectedResult);
    expect(cryptoTokenRepository_getByOwner).toBeCalledTimes(1);
    expect(cryptoTokenRepository_getByOwner).toBeCalledWith(
      useCaseParams.owner,
      useCaseParams.contract,
    );
    expect(cryptoTokenRepository_getList).toBeCalledTimes(0);
  });

  test('execute succesfully with no owner param', async () => {
    const cryptoTokenRepository: CryptoTokenRepository =
      new CryptoTokenMockRepository();
    const useCase: GetCryptoTokensListUseCase = new GetCryptoTokensListUseCase(
      cryptoTokenRepository,
    );
    const listOfTokens = [
      new CryptoTokenEntity({ tokenId: '1', contract: '1', owner: '1' }),
      new CryptoTokenEntity({ tokenId: '2', contract: '2', owner: '2' }),
      new CryptoTokenEntity({ tokenId: '3', contract: '3', owner: '3' }),
    ];
    const useCaseParams: GetCryptoTokensListRequestDto = {
      contract: '1',
    };
    const expectedResult: GetCryptoTokensListResponseDto = listOfTokens.map(
      (token) => token.toJSON(),
    );

    const cryptoTokenRepository_getList = jest
      .spyOn(cryptoTokenRepository, 'getList')
      .mockResolvedValue(Promise.resolve(listOfTokens));
    const cryptoTokenRepository_getByOwner = jest
      .spyOn(cryptoTokenRepository, 'getByOwner')
      .mockResolvedValue(Promise.resolve(listOfTokens));

    const useCaseResult: GetCryptoTokensListResponseDto = await useCase.execute(
      useCaseParams,
    );
    expect(useCaseResult).toBeDefined();
    expect(useCaseResult).toEqual(expectedResult);
    expect(cryptoTokenRepository_getByOwner).toBeCalledTimes(0);
    expect(cryptoTokenRepository_getList).toBeCalledTimes(1);
    expect(cryptoTokenRepository_getList).toBeCalledWith(
      useCaseParams.contract,
    );
  });
});
