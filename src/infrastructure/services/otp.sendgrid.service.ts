import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { OtpEntity } from '@domain/entities';
import { OtpNotFoundError } from '@domain/errors';
import { OtpRepository } from '@domain/repositories';
import { OtpService } from '@domain/services';
import { OtpReference } from '@domain/types';
import {
  SENDGRID_PROVIDER_TOKEN,
  SendGridProvider,
  EmailTemplatesEnum,
} from 'src/libs/providers';

@Injectable()
export class OtpSendgridService implements OtpService {
  readonly logger: Logger = new Logger(OtpSendgridService.name);

  constructor(
    @Inject(SENDGRID_PROVIDER_TOKEN)
    private readonly sendGridProvider: SendGridProvider,
    private readonly otpRepository: OtpRepository,
  ) {}

  async providerSend(otpEntity: OtpEntity): Promise<void> {
    const { otp, reference, email } = otpEntity.toJSON();
    this.logger.debug(
      `Email: ${email}, OTP code: ${otp}, reference: ${reference}`,
    );
    await this.sendGridProvider.send({
      to: email,
      templateName: EmailTemplatesEnum.OTPCode,
      payload: {
        otp,
      },
    });
  }

  protected getOtpEntity(email: string): OtpEntity {
    return new OtpEntity({
      email,
    });
  }

  async sendOpt(email: string): Promise<OtpEntity> {
    try {
      this.logger.debug(`Call sendOpt ${JSON.stringify({ email })}`);

      const otpEntity = this.getOtpEntity(email);

      this.logger.debug(`Otp entity ${JSON.stringify(otpEntity.toJSON())}`);

      await this.providerSend(otpEntity);

      await this.otpRepository.createOtp(otpEntity);

      return otpEntity;
    } catch (err: unknown) {
      const message = `Error send verification request to sendgrid: ${
        (err as Error).message
      }`;
      this.logger.error(message);

      throw new InternalServerErrorException(message);
    }
  }

  async validateOpt(
    otpCode: string,
    reference: OtpReference,
  ): Promise<boolean> {
    this.logger.debug(
      `Call validateOpt ${JSON.stringify({ otpCode, reference })}`,
    );

    const otpEntity = await this.otpRepository.getOtpByReference(reference);

    if (!otpEntity) {
      this.logger.error('OTP entity not found in storage');
      throw new OtpNotFoundError(`OTP for ${otpEntity.email} not exist`);
    }

    if (otpEntity.otp !== otpCode) {
      this.logger.error(
        `Code ${otpCode} is not match for reference ${reference}. Expected code ${otpEntity.otp}`,
      );
      return false;
    }

    await this.otpRepository.deleteOtpByReference(reference);

    return true;
  }
}
