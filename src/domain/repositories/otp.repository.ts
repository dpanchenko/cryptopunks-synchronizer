import { OtpEntity } from '../entities';
import { OtpReference } from '../types';

export abstract class OtpRepository {
  abstract getOtpByReference(
    reference: OtpReference,
  ): Promise<OtpEntity | null>;
  abstract createOtp(otp: OtpEntity): Promise<void>;
  abstract deleteOtpByReference(reference: OtpReference): Promise<void>;
}
