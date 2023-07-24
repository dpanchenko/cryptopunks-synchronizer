import { Injectable } from '@nestjs/common';
import { AuthTokensBlacklistRepository } from '@domain/repositories';

@Injectable()
export class AuthTokensBlacklistMockRepository
  implements AuthTokensBlacklistRepository
{
  async checkToken(_token: string): Promise<boolean> {
    return Promise.resolve(true);
  }
  async saveToken(_token: string): Promise<void> {
    return Promise.resolve();
  }
}
