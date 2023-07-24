import { Injectable } from '@nestjs/common';
import { OtpEntity } from '@domain/entities';
import { OtpRepository } from '@domain/repositories';
import { OtpReference } from '@domain/types';

@Injectable()
export class OtpMockRepository implements OtpRepository {
  async getOtpByReference(_reference: OtpReference): Promise<OtpEntity | null> {
    return Promise.resolve(null);
  }

  async createOtp(_otp: OtpEntity): Promise<void> {
    return Promise.resolve();
  }

  async deleteOtpByReference(_reference: OtpReference): Promise<void> {
    return Promise.resolve();
  }
}
