import { OtpReference } from '@domain/types';

export interface OtpConfirmRequestDto {
  otpCode: string;
  otpReference: OtpReference;
}
