import * as dotenv from 'dotenv';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AppConfigValidator, getAppConfig, IAppConfig } from './app';
import { AuthConfigValidator, getAuthConfig, IAuthConfig } from './auth';
import {
  BlockchainConfigValidator,
  getBlockchainConfig,
  IBlockchainConfig,
} from './blockchain';
import { CacheConfigValidator, getCacheConfig, ICacheConfig } from './cache';
import {
  getLoggerConfig,
  ILoggerConfig,
  LoggerConfigValidator,
} from './logger';
import {
  IMongodbConfig,
  MongodbConfigValidator,
  getMongodbConfig,
} from './mongodb';
import { RedisConfigValidator, getRedisConfig, IRedisConfig } from './redis';
import {
  getSendGridConfig,
  ISendGridConfig,
  SendGridConfigValidator,
} from './sendgrid';
import { validate } from './validate';

dotenv.config();

export interface IConfig {
  app: IAppConfig;
  auth: IAuthConfig;
  blockchain: IBlockchainConfig;
  cache: ICacheConfig;
  logger: ILoggerConfig;
  mongodb: IMongodbConfig;
  redis: IRedisConfig;
  sendgrid: ISendGridConfig;
}

export class ConfigValidator implements IConfig {
  @ValidateNested()
  @Type(() => AppConfigValidator)
  readonly app!: AppConfigValidator;

  @ValidateNested()
  @Type(() => AuthConfigValidator)
  readonly auth!: AuthConfigValidator;

  @ValidateNested()
  @Type(() => BlockchainConfigValidator)
  readonly blockchain!: BlockchainConfigValidator;

  @ValidateNested()
  @Type(() => CacheConfigValidator)
  readonly cache!: CacheConfigValidator;

  @ValidateNested()
  @Type(() => LoggerConfigValidator)
  readonly logger!: LoggerConfigValidator;

  @Type(() => MongodbConfigValidator)
  readonly mongodb!: MongodbConfigValidator;

  @ValidateNested()
  @Type(() => RedisConfigValidator)
  readonly redis!: RedisConfigValidator;

  @ValidateNested()
  @Type(() => SendGridConfigValidator)
  readonly sendgrid!: SendGridConfigValidator;
}

export const getConfig = (): IConfig => {
  const config: IConfig = {
    app: getAppConfig(),
    auth: getAuthConfig(),
    blockchain: getBlockchainConfig(),
    cache: getCacheConfig(),
    redis: getRedisConfig(),
    logger: getLoggerConfig(),
    mongodb: getMongodbConfig(),
    sendgrid: getSendGridConfig(),
  };

  return validate<IConfig, ConfigValidator>(config, ConfigValidator);
};
