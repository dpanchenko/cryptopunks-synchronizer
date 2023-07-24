import { Injectable, Logger } from '@nestjs/common';

import { OtpEntity } from '@domain/entities';
import { OtpSendgridService } from './otp.sendgrid.service';

@Injectable()
export class OtpEmulationService extends OtpSendgridService {
  readonly logger: Logger = new Logger(OtpEmulationService.name);

  protected getOtpEntity(email: string): OtpEntity {
    return new OtpEntity({
      email: email,
      otp: '1111',
    });
  }

  async providerSend(otpEntity: OtpEntity): Promise<void> {
    const { otp, reference, email } = otpEntity.toJSON();
    this.logger.debug(
      `This is EMULATION, no real message sent! Email: ${email}, OTP code: ${otp}, reference: ${reference}`,
    );
  }
}
