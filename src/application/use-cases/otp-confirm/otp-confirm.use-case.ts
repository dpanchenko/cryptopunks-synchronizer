import { OtpNotValidError, OtpReferenceNotFoundError } from '@domain/errors';
import { OtpService, AuthTokenService } from '@domain/services';
import { OtpRepository } from '@domain/repositories';

import { OtpConfirmRequestDto } from './otp-confirm.request.dto';
import { OtpConfirmResponseDto } from './otp-confirm.response.dto';

export class OtpConfirmUseCase {
  constructor(
    private readonly otpService: OtpService,
    private readonly authTokenService: AuthTokenService,
    private readonly otpRepository: OtpRepository,
  ) {}

  async execute(params: OtpConfirmRequestDto): Promise<OtpConfirmResponseDto> {
    const { otpCode, otpReference } = params;

    const otpEntity = await this.otpRepository.getOtpByReference(otpReference);

    if (!otpEntity) {
      throw new OtpReferenceNotFoundError(
        `OTP reference ${otpReference} not exist`,
      );
    }

    const isOtpValid: boolean = await this.otpService.validateOpt(
      otpCode,
      otpReference,
    );

    if (!isOtpValid) {
      throw new OtpNotValidError(`OTP for ${otpEntity.email} not valid`);
    }

    const { accessToken, refreshToken } =
      await this.authTokenService.generateAuthToken(otpEntity.email);

    return {
      accessToken,
      refreshToken,
    };
  }
}
