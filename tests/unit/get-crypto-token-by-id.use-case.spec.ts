import {
  GetCryptoTokenByIdUseCase,
  GetCryptoTokenByIdRequestDto,
  GetCryptoTokenByIdResponseDto,
} from '@application/use-cases';
import { CryptoTokenEntity } from '@domain/entities';
import { CryptoTokenRepository } from '@domain/repositories';

import { CryptoTokenMockRepository } from './mocks/repositories';

describe('Get token by id use case', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('execute succesfully', async () => {
    const cryptoTokenRepository: CryptoTokenRepository =
      new CryptoTokenMockRepository();
    const useCase: GetCryptoTokenByIdUseCase = new GetCryptoTokenByIdUseCase(
      cryptoTokenRepository,
    );
    const existingToken = new CryptoTokenEntity({
      tokenId: '1',
      contract: '1',
      owner: '1',
    });
    const useCaseParams: GetCryptoTokenByIdRequestDto = {
      contract: '1',
      tokenId: '1',
    };
    const expectedResult: GetCryptoTokenByIdResponseDto =
      existingToken.toJSON();

    const cryptoTokenRepository_getTokenById = jest
      .spyOn(cryptoTokenRepository, 'getTokenById')
      .mockResolvedValue(Promise.resolve(existingToken));

    const useCaseResult: GetCryptoTokenByIdResponseDto = await useCase.execute(
      useCaseParams,
    );
    expect(useCaseResult).toBeDefined();
    expect(useCaseResult).toEqual(expectedResult);
    expect(cryptoTokenRepository_getTokenById).toBeCalledTimes(1);
    expect(cryptoTokenRepository_getTokenById).toBeCalledWith(
      useCaseParams.tokenId,
      useCaseParams.contract,
    );
  });

  test('throw becasue token not exist', async () => {
    const cryptoTokenRepository: CryptoTokenRepository =
      new CryptoTokenMockRepository();
    const useCase: GetCryptoTokenByIdUseCase = new GetCryptoTokenByIdUseCase(
      cryptoTokenRepository,
    );
    const useCaseParams: GetCryptoTokenByIdRequestDto = {
      contract: '1',
      tokenId: '1',
    };

    const cryptoTokenRepository_getTokenById = jest
      .spyOn(cryptoTokenRepository, 'getTokenById')
      .mockResolvedValue(Promise.resolve(null));

    try {
      await useCase.execute(useCaseParams);

      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toBe(
        `Token ${useCaseParams.tokenId} on contract ${useCaseParams.contract}`,
      );
      expect(cryptoTokenRepository_getTokenById).toBeCalledTimes(1);
      expect(cryptoTokenRepository_getTokenById).toBeCalledWith(
        useCaseParams.tokenId,
        useCaseParams.contract,
      );
    }
  });
});
