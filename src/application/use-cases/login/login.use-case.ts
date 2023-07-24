import { OtpEntity } from '@domain/entities';
import { OtpService } from '@domain/services';

import { LoginRequestDto } from './login.request.dto';
import { LoginResponseDto } from './login.response.dto';

export class LoginUseCase {
  constructor(private readonly otpService: OtpService) {}

  async execute(params: LoginRequestDto): Promise<LoginResponseDto> {
    const { email } = params;

    const otpEntity: OtpEntity = await this.otpService.sendOpt(email);

    return {
      otpReference: otpEntity.reference,
    };
  }
}
