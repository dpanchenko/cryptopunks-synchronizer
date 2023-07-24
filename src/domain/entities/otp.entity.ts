import { v4 as uuidv4 } from 'uuid';
import { IOtp, UUID } from '../types';

export class OtpEntity implements IOtp {
  public reference: UUID;
  public email: string;
  public otp: string;

  constructor(params: IOtp) {
    this.reference = params.reference ?? uuidv4();
    this.email = params.email;
    this.otp = params.otp ?? `${Math.floor(Math.random() * 8999 + 1000)}`;
  }

  toJSON(): IOtp {
    return {
      otp: this.otp,
      email: this.email,
      reference: this.reference,
    };
  }
}
