import { OtpEntity } from '../entities';
import { OtpReference } from '../types';

export abstract class OtpService {
  abstract sendOpt(email: string): Promise<OtpEntity>;
  abstract validateOpt(
    otpCode: string,
    reference: OtpReference,
  ): Promise<boolean>;
}
