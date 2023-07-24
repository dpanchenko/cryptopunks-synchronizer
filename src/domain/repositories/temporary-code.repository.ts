export abstract class TemporaryCodeRepository {
  abstract saveVerificationCode(email: string, code: string): Promise<void>;
  abstract checkVerificationCode(email: string, code: string): Promise<boolean>;
}
