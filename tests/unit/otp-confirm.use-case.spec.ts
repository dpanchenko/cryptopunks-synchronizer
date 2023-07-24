import {
  OtpConfirmUseCase,
  OtpConfirmRequestDto,
  OtpConfirmResponseDto,
} from '@application/use-cases';
import { OtpEntity } from '@domain/entities';
import { OtpService, AuthTokenService } from '@domain/services';
import { OtpRepository } from '@domain/repositories';

import { OtpMockService, AuthTokenMockService } from './mocks/services';
import { OtpMockRepository } from './mocks/repositories';

describe('OTP confirm use case', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('execute succesfully', async () => {
    const otpService: OtpService = new OtpMockService();
    const authTokenService: AuthTokenService = new AuthTokenMockService();
    const otpRepository: OtpRepository = new OtpMockRepository();
    const useCase: OtpConfirmUseCase = new OtpConfirmUseCase(
      otpService,
      authTokenService,
      otpRepository,
    );
    const useCaseParams: OtpConfirmRequestDto = {
      otpCode: '1111',
      otpReference: 'mockreference',
    };
    const expectedResult: OtpConfirmResponseDto = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    const emailConstant = 'test@email.com';

    const otpRepository_getOtpByReference = jest
      .spyOn(otpRepository, 'getOtpByReference')
      .mockResolvedValue(
        Promise.resolve(
          new OtpEntity({
            email: emailConstant,
            reference: useCaseParams.otpReference,
            otp: useCaseParams.otpCode,
          }),
        ),
      );
    const otpService_validateOpt = jest
      .spyOn(otpService, 'validateOpt')
      .mockResolvedValue(Promise.resolve(true));
    const authTokenService_generateAuthToken = jest
      .spyOn(authTokenService, 'generateAuthToken')
      .mockResolvedValue(Promise.resolve(expectedResult));

    const useCaseResult: OtpConfirmResponseDto = await useCase.execute(
      useCaseParams,
    );
    expect(useCaseResult).toBeDefined();
    expect(useCaseResult).toEqual(expectedResult);
    expect(otpRepository_getOtpByReference).toBeCalledTimes(1);
    expect(otpRepository_getOtpByReference).toBeCalledWith(
      useCaseParams.otpReference,
    );
    expect(otpService_validateOpt).toBeCalledTimes(1);
    expect(otpService_validateOpt).toBeCalledWith(
      useCaseParams.otpCode,
      useCaseParams.otpReference,
    );
    expect(authTokenService_generateAuthToken).toBeCalledTimes(1);
    expect(authTokenService_generateAuthToken).toBeCalledWith(emailConstant);
  });

  test('should throw when reference not exist', async () => {
    const otpService: OtpService = new OtpMockService();
    const authTokenService: AuthTokenService = new AuthTokenMockService();
    const otpRepository: OtpRepository = new OtpMockRepository();
    const useCase: OtpConfirmUseCase = new OtpConfirmUseCase(
      otpService,
      authTokenService,
      otpRepository,
    );
    const useCaseParams: OtpConfirmRequestDto = {
      otpCode: '1111',
      otpReference: 'mockreference',
    };
    const expectedResult: OtpConfirmResponseDto = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    const otpRepository_getOtpByReference = jest
      .spyOn(otpRepository, 'getOtpByReference')
      .mockResolvedValue(Promise.resolve(null));
    const otpService_validateOpt = jest
      .spyOn(otpService, 'validateOpt')
      .mockResolvedValue(Promise.resolve(true));
    const authTokenService_generateAuthToken = jest
      .spyOn(authTokenService, 'generateAuthToken')
      .mockResolvedValue(Promise.resolve(expectedResult));

    try {
      await useCase.execute(useCaseParams);

      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toBe(
        `OTP reference ${useCaseParams.otpReference} not exist`,
      );
      expect(otpRepository_getOtpByReference).toBeCalledTimes(1);
      expect(otpRepository_getOtpByReference).toBeCalledWith(
        useCaseParams.otpReference,
      );
      expect(otpService_validateOpt).toBeCalledTimes(0);
      expect(authTokenService_generateAuthToken).toBeCalledTimes(0);
    }
  });

  test('should throw when otp is not valid', async () => {
    const otpService: OtpService = new OtpMockService();
    const authTokenService: AuthTokenService = new AuthTokenMockService();
    const otpRepository: OtpRepository = new OtpMockRepository();
    const useCase: OtpConfirmUseCase = new OtpConfirmUseCase(
      otpService,
      authTokenService,
      otpRepository,
    );
    const useCaseParams: OtpConfirmRequestDto = {
      otpCode: '1111',
      otpReference: 'mockreference',
    };
    const expectedResult: OtpConfirmResponseDto = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    const emailConstant = 'test@email.com';

    const otpRepository_getOtpByReference = jest
      .spyOn(otpRepository, 'getOtpByReference')
      .mockResolvedValue(
        Promise.resolve(
          new OtpEntity({
            email: emailConstant,
            reference: useCaseParams.otpReference,
            otp: useCaseParams.otpCode,
          }),
        ),
      );
    const otpService_validateOpt = jest
      .spyOn(otpService, 'validateOpt')
      .mockResolvedValue(Promise.resolve(false));
    const authTokenService_generateAuthToken = jest
      .spyOn(authTokenService, 'generateAuthToken')
      .mockResolvedValue(Promise.resolve(expectedResult));

    try {
      await useCase.execute(useCaseParams);

      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toBe(`OTP for ${emailConstant} not valid`);
      expect(otpRepository_getOtpByReference).toBeCalledTimes(1);
      expect(otpRepository_getOtpByReference).toBeCalledWith(
        useCaseParams.otpReference,
      );
      expect(otpService_validateOpt).toBeCalledTimes(1);
      expect(otpService_validateOpt).toBeCalledWith(
        useCaseParams.otpCode,
        useCaseParams.otpReference,
      );
      expect(authTokenService_generateAuthToken).toBeCalledTimes(0);
    }
  });
});
