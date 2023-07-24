import { IsInt, IsOptional } from 'class-validator';

export interface ICacheConfig {
  defaultTtl: number;
  verifyCodeTtl?: number;
}

export class CacheConfigValidator implements ICacheConfig {
  @IsInt()
  readonly defaultTtl!: number;

  @IsInt()
  @IsOptional()
  readonly verifyCodeTtl?: number;

  @IsInt()
  @IsOptional()
  readonly inviteEmailCodeTtl?: number;
}

export const getCacheConfig = (): ICacheConfig => ({
  defaultTtl: parseInt(process.env.CACHE_DEFAULT_TTL, 10),
  verifyCodeTtl: process.env.CACHE_VERIFY_CODE_TTL
    ? parseInt(process.env.CACHE_VERIFY_CODE_TTL, 10)
    : null,
});
