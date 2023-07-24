import { Injectable } from '@nestjs/common';

import { OtpEntity } from '@domain/entities';
import { OtpService } from '@domain/services';
import { OtpReference } from '@domain/types';

@Injectable()
export class OtpMockService implements OtpService {
  async sendOpt(_email: string): Promise<OtpEntity> {
    return Promise.resolve(new OtpEntity({ email: '' }));
  }

  async validateOpt(
    _otpCode: string,
    _reference: OtpReference,
  ): Promise<boolean> {
    return Promise.resolve(true);
  }
}
