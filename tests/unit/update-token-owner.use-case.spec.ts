import {
  UpdateTokenOwnerUseCase,
  UpdateTokenOwnerRequestDto,
  UpdateTokenOwnerResponseDto,
} from '@application/use-cases';
import { CryptoTokenEntity } from '@domain/entities';
import { CryptoTokenRepository } from '@domain/repositories';

import { CryptoTokenMockRepository } from './mocks/repositories';

describe('Update token owner use case', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('execute succesfully update existing token', async () => {
    const cryptoTokenRepository: CryptoTokenRepository =
      new CryptoTokenMockRepository();
    const useCase: UpdateTokenOwnerUseCase = new UpdateTokenOwnerUseCase(
      cryptoTokenRepository,
    );
    const existingToken = new CryptoTokenEntity({
      tokenId: '1',
      contract: '1',
      owner: '1',
    });
    const useCaseParams: UpdateTokenOwnerRequestDto = {
      contract: '1',
      tokenId: '1',
      owner: '2',
    };
    const expectedResult: UpdateTokenOwnerResponseDto = {
      token: {
        ...existingToken.toJSON(),
        owner: '2',
      },
    };

    const cryptoTokenRepository_getTokenById = jest
      .spyOn(cryptoTokenRepository, 'getTokenById')
      .mockResolvedValue(Promise.resolve(existingToken));
    const cryptoTokenRepository_save = jest.spyOn(
      cryptoTokenRepository,
      'save',
    );

    const useCaseResult: UpdateTokenOwnerResponseDto = await useCase.execute(
      useCaseParams,
    );
    expect(useCaseResult).toBeDefined();
    expect(useCaseResult).toEqual(expectedResult);
    expect(cryptoTokenRepository_getTokenById).toBeCalledTimes(1);
    expect(cryptoTokenRepository_getTokenById).toBeCalledWith(
      useCaseParams.tokenId,
      useCaseParams.contract,
    );
    expect(cryptoTokenRepository_save).toBeCalledTimes(1);
    existingToken.owner = expectedResult.token.owner;
    expect(cryptoTokenRepository_save).toBeCalledWith(existingToken);
  });

  test('execute succesfully add new token', async () => {
    const cryptoTokenRepository: CryptoTokenRepository =
      new CryptoTokenMockRepository();
    const useCase: UpdateTokenOwnerUseCase = new UpdateTokenOwnerUseCase(
      cryptoTokenRepository,
    );
    const useCaseParams: UpdateTokenOwnerRequestDto = {
      contract: '1',
      tokenId: '1',
      owner: '2',
    };
    const newToken = new CryptoTokenEntity(useCaseParams);
    const expectedResult: UpdateTokenOwnerResponseDto = {
      token: newToken.toJSON(),
    };

    const cryptoTokenRepository_getTokenById = jest
      .spyOn(cryptoTokenRepository, 'getTokenById')
      .mockResolvedValue(Promise.resolve(null));
    const cryptoTokenRepository_save = jest.spyOn(
      cryptoTokenRepository,
      'save',
    );

    const useCaseResult: UpdateTokenOwnerResponseDto = await useCase.execute(
      useCaseParams,
    );
    expect(useCaseResult).toBeDefined();
    expect(useCaseResult).toEqual(expectedResult);
    expect(cryptoTokenRepository_getTokenById).toBeCalledTimes(1);
    expect(cryptoTokenRepository_getTokenById).toBeCalledWith(
      useCaseParams.tokenId,
      useCaseParams.contract,
    );
    expect(cryptoTokenRepository_save).toBeCalledTimes(1);
    expect(cryptoTokenRepository_save).toBeCalledWith(newToken);
  });
});
