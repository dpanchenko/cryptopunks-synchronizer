import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OtpEntity } from '@domain/entities';
import { OtpRepository } from '@domain/repositories';
import { OtpReference } from '@domain/types';

const TTL_10_MINUTES = 600000;

@Injectable()
export class OtpRedisRepository implements OtpRepository {
  private readonly logger: Logger = new Logger(OtpRedisRepository.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getOtpByReference(reference: OtpReference): Promise<OtpEntity | null> {
    this.logger.debug(`Get otp entity by reference otp:reference:${reference}`);

    const otpData = await this.cacheManager.get<OtpEntity>(
      `otp:reference:${reference}`,
    );
    this.logger.debug(`OtpEntity ${JSON.stringify(otpData)}`);

    return otpData ? new OtpEntity(otpData) : null;
  }

  async createOtp(otp: OtpEntity): Promise<void> {
    this.logger.debug(`Call createOtp ${JSON.stringify({ otp })}`);

    await this.cacheManager.set(
      `otp:reference:${otp.reference}`,
      otp,
      TTL_10_MINUTES,
    );
  }

  async deleteOtpByReference(reference: OtpReference): Promise<void> {
    this.logger.debug(
      `Call deleteOtpByReference ${JSON.stringify({ reference })}`,
    );

    await this.cacheManager.del(`otp:reference:${reference}`);
  }
}
