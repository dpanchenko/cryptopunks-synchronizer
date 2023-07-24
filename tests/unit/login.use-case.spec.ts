import {
  LoginUseCase,
  LoginRequestDto,
  LoginResponseDto,
} from '@application/use-cases';
import { OtpEntity } from '@domain/entities';
import { OtpService } from '@domain/services';

import { OtpMockService } from './mocks/services';

describe('Login use case', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('execute', async () => {
    const otpService: OtpService = new OtpMockService();
    const useCase: LoginUseCase = new LoginUseCase(otpService);
    const useCaseParams: LoginRequestDto = {
      email: 'test@email.com',
    };
    const expectedResult: LoginResponseDto = {
      otpReference: 'mockreference',
    };

    const otpService_sendOpt = jest
      .spyOn(otpService, 'sendOpt')
      .mockReturnValueOnce(
        Promise.resolve(
          new OtpEntity({
            email: useCaseParams.email,
            reference: expectedResult.otpReference,
            otp: '1111',
          }),
        ),
      );

    const useCaseResult: LoginResponseDto = await useCase.execute(
      useCaseParams,
    );
    expect(useCaseResult).toBeDefined();
    expect(useCaseResult).toEqual(expectedResult);
    expect(otpService_sendOpt).toBeCalledTimes(1);
    expect(otpService_sendOpt).toBeCalledWith(useCaseParams.email);
  });
});
