import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

import { ICacheConfig } from '@config/index';
import { TemporaryCodeRepository } from '@domain/repositories';
import { UUID } from '@domain/types';

@Injectable()
export class TemporaryCodeRedisRepository implements TemporaryCodeRepository {
  private readonly logger: Logger = new Logger(
    TemporaryCodeRedisRepository.name,
  );
  private readonly cacheConfig: ICacheConfig;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.cacheConfig = this.configService.get('cache') as ICacheConfig;
  }

  private async saveCode(
    entityId: UUID,
    key: string,
    ttl: number,
  ): Promise<void> {
    await this.cacheManager.set(key, entityId, ttl);
  }

  private async checkCode(entityId: UUID, key: string): Promise<boolean> {
    const savedEntityId = await this.cacheManager.get<UUID>(key);

    if (entityId === savedEntityId) {
      await this.cacheManager.del(key);

      return true;
    }

    return false;
  }

  async saveVerificationCode(email: string, code: string): Promise<void> {
    this.logger.debug(`Save to cache ${email} email verification code ${code}`);

    await this.saveCode(
      email,
      `email:verification:${code}`,
      this.cacheConfig.verifyCodeTtl,
    );
  }

  async checkVerificationCode(email: string, code: string): Promise<boolean> {
    this.logger.debug(
      `Check verification code ${code} for email ${email} in cache`,
    );

    return this.checkCode(email, `email:verification:${code}`);
  }
}
