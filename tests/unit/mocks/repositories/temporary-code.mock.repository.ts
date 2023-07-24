import { Injectable } from '@nestjs/common';
import { TemporaryCodeRepository } from '@domain/repositories';

@Injectable()
export class TemporaryCodeMockRepository implements TemporaryCodeRepository {
  async saveVerificationCode(_email: string, _code: string): Promise<void> {
    return Promise.resolve();
  }

  async checkVerificationCode(_email: string, _code: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
