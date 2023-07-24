import {
  RefreshTokensUseCase,
  RefreshTokensRequestDto,
  RefreshTokensResponseDto,
} from '@application/use-cases';
import { AuthTokenService } from '@domain/services';
import { AuthTokensBlacklistRepository } from '@domain/repositories';

import { AuthTokenMockService } from './mocks/services';
import { AuthTokensBlacklistMockRepository } from './mocks/repositories';

describe('Refresh tokens use case', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('execute succesfully', async () => {
    const authTokenService: AuthTokenService = new AuthTokenMockService();
    const authTokensBlacklistRepository: AuthTokensBlacklistRepository =
      new AuthTokensBlacklistMockRepository();
    const useCase: RefreshTokensUseCase = new RefreshTokensUseCase(
      authTokenService,
      authTokensBlacklistRepository,
    );
    const useCaseParams: RefreshTokensRequestDto = {
      token: 'token',
    };
    const expectedResult: RefreshTokensResponseDto = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    const emailConstant = 'test@email.com';

    const authTokensBlacklistRepository_checkToken = jest
      .spyOn(authTokensBlacklistRepository, 'checkToken')
      .mockResolvedValue(Promise.resolve(false));
    const authTokenService_verifyRefreshToken = jest
      .spyOn(authTokenService, 'verifyRefreshToken')
      .mockResolvedValue(Promise.resolve({ email: emailConstant }));
    const authTokenService_generateAuthToken = jest
      .spyOn(authTokenService, 'generateAuthToken')
      .mockResolvedValue(Promise.resolve(expectedResult));
    const authTokensBlacklistRepository_saveToken = jest
      .spyOn(authTokensBlacklistRepository, 'saveToken')
      .mockResolvedValue(Promise.resolve());

    const useCaseResult: RefreshTokensResponseDto = await useCase.execute(
      useCaseParams,
    );
    expect(useCaseResult).toBeDefined();
    expect(useCaseResult).toEqual(expectedResult);
    expect(authTokensBlacklistRepository_checkToken).toBeCalledTimes(1);
    expect(authTokensBlacklistRepository_checkToken).toBeCalledWith(
      useCaseParams.token,
    );
    expect(authTokenService_verifyRefreshToken).toBeCalledTimes(1);
    expect(authTokenService_verifyRefreshToken).toBeCalledWith(
      useCaseParams.token,
    );
    expect(authTokenService_generateAuthToken).toBeCalledTimes(1);
    expect(authTokenService_generateAuthToken).toBeCalledWith(emailConstant);
    expect(authTokensBlacklistRepository_saveToken).toBeCalledTimes(1);
    expect(authTokensBlacklistRepository_saveToken).toBeCalledWith(
      useCaseParams.token,
    );
  });

  test('should throw when token is in blacklist', async () => {
    const authTokenService: AuthTokenService = new AuthTokenMockService();
    const authTokensBlacklistRepository: AuthTokensBlacklistRepository =
      new AuthTokensBlacklistMockRepository();
    const useCase: RefreshTokensUseCase = new RefreshTokensUseCase(
      authTokenService,
      authTokensBlacklistRepository,
    );
    const useCaseParams: RefreshTokensRequestDto = {
      token: 'token',
    };
    const expectedResult: RefreshTokensResponseDto = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    const emailConstant = 'test@email.com';

    const authTokensBlacklistRepository_checkToken = jest
      .spyOn(authTokensBlacklistRepository, 'checkToken')
      .mockResolvedValue(Promise.resolve(true));
    const authTokenService_verifyRefreshToken = jest
      .spyOn(authTokenService, 'verifyRefreshToken')
      .mockResolvedValue(Promise.resolve({ email: emailConstant }));
    const authTokenService_generateAuthToken = jest
      .spyOn(authTokenService, 'generateAuthToken')
      .mockResolvedValue(Promise.resolve(expectedResult));
    const authTokensBlacklistRepository_saveToken = jest
      .spyOn(authTokensBlacklistRepository, 'saveToken')
      .mockResolvedValue(Promise.resolve());

    try {
      await useCase.execute(useCaseParams);

      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toBe(
        `Token ${useCaseParams.token} is expired`,
      );
      expect(authTokensBlacklistRepository_checkToken).toBeCalledTimes(1);
      expect(authTokensBlacklistRepository_checkToken).toBeCalledWith(
        useCaseParams.token,
      );
      expect(authTokenService_verifyRefreshToken).toBeCalledTimes(0);
      expect(authTokenService_generateAuthToken).toBeCalledTimes(0);
      expect(authTokensBlacklistRepository_saveToken).toBeCalledTimes(0);
    }
  });

  test('should throw when jwt token is expired', async () => {
    const authTokenService: AuthTokenService = new AuthTokenMockService();
    const authTokensBlacklistRepository: AuthTokensBlacklistRepository =
      new AuthTokensBlacklistMockRepository();
    const useCase: RefreshTokensUseCase = new RefreshTokensUseCase(
      authTokenService,
      authTokensBlacklistRepository,
    );
    const useCaseParams: RefreshTokensRequestDto = {
      token: 'token',
    };
    const expectedResult: RefreshTokensResponseDto = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    const authTokensBlacklistRepository_checkToken = jest
      .spyOn(authTokensBlacklistRepository, 'checkToken')
      .mockResolvedValue(Promise.resolve(false));
    const authTokenService_verifyRefreshToken = jest
      .spyOn(authTokenService, 'verifyRefreshToken')
      .mockResolvedValue(Promise.reject(new Error('Token is expired')));
    const authTokenService_generateAuthToken = jest
      .spyOn(authTokenService, 'generateAuthToken')
      .mockResolvedValue(Promise.resolve(expectedResult));
    const authTokensBlacklistRepository_saveToken = jest
      .spyOn(authTokensBlacklistRepository, 'saveToken')
      .mockResolvedValue(Promise.resolve());

    try {
      await useCase.execute(useCaseParams);

      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toBe(`Token is expired`);
      expect(authTokensBlacklistRepository_checkToken).toBeCalledTimes(1);
      expect(authTokensBlacklistRepository_checkToken).toBeCalledWith(
        useCaseParams.token,
      );
      expect(authTokenService_verifyRefreshToken).toBeCalledTimes(1);
      expect(authTokenService_generateAuthToken).toBeCalledTimes(0);
      expect(authTokensBlacklistRepository_saveToken).toBeCalledTimes(0);
    }
  });
});
