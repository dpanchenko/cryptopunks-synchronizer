import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthTokensBlacklistRepository } from '@domain/repositories';

const TTL_10_DAYS = 864000000;

@Injectable()
export class AuthTokensBlacklistRedisRepository
  implements AuthTokensBlacklistRepository
{
  private readonly logger: Logger = new Logger(
    AuthTokensBlacklistRedisRepository.name,
  );

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async checkToken(token: string): Promise<boolean> {
    this.logger.debug(
      `Check if token exists in blacklist token:refresh:${token}`,
    );

    const exist = await this.cacheManager.get<number>(`token:refresh:${token}`);
    this.logger.debug(`Token exist in blacklist ${!!exist}`);

    return !!exist;
  }
  async saveToken(token: string): Promise<void> {
    this.logger.debug(`Call save token in blacklist ${token}`);

    await this.cacheManager.set(`token:refresh:${token}`, 1, TTL_10_DAYS);
  }
}
