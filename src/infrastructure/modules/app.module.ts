import * as cacheManagerIoredis from 'cache-manager-ioredis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import {
  getConfig,
  IAppConfig,
  IAuthConfig,
  IBlockchainConfig,
  ICacheConfig,
  IMongodbConfig,
  IRedisConfig,
  ISendGridConfig,
} from '@config/index';

import {
  ETHERS_PROVIDER_TOKEN,
  EthersProvider,
  MJML_PROVIDER_TOKEN,
  MJMLProvider,
  MONGODB_PROVIDER_TOKEN,
  MongodbProvider,
  SENDGRID_PROVIDER_TOKEN,
  SendGridProvider,
} from '@libs/providers';
import {
  OtpConfirmUseCase,
  LoginUseCase,
  RefreshTokensUseCase,
  SynchronizeTokensUseCase,
  SubscribeOnTransferUseCase,
  UpdateTokenOwnerUseCase,
  GetCryptoTokenByIdUseCase,
  GetCryptoTokensListUseCase,
} from '@application/use-cases';
import {
  AuthTokensBlacklistRepository,
  CryptoTokenRepository,
  OtpRepository,
  TemporaryCodeRepository,
} from '@domain/repositories';
import {
  AuthTokenService,
  BlockchainService,
  OtpService,
} from '@domain/services';
import {
  AuthTokensBlacklistRedisRepository,
  CryptoTokenMongodbRepository,
  OtpRedisRepository,
  TemporaryCodeRedisRepository,
} from '../repositories';
import {
  AuthTokenJwtService,
  BlockchainEthersService,
  OtpSendgridService,
  OtpEmulationService,
} from '../services';
import { SynchronizeWorker } from '../workers';

import {
  LoginResolver,
  RefreshAuthTokenResolver,
  TokenByIdResolver,
  TokensListResolver,
  VerifyResolver,
} from '../resolvers';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [getConfig],
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const redisConfig: IRedisConfig =
          configService.get<IRedisConfig>('redis');
        const cacheConfig: ICacheConfig =
          configService.get<ICacheConfig>('cache');

        return {
          store: cacheManagerIoredis,
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
          db: redisConfig.database,
          ttl: cacheConfig.defaultTtl,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      driver: ApolloDriver,
      playground: true,
      debug: true,
      installSubscriptionHandlers: true,
    }),
    JwtModule,
  ],
  controllers: [],
  providers: [
    {
      provide: ETHERS_PROVIDER_TOKEN,
      useFactory: (configService: ConfigService) => {
        const blockchainConfig: IBlockchainConfig =
          configService.get<IBlockchainConfig>('blockchain');
        return new EthersProvider(blockchainConfig);
      },
      inject: [ConfigService],
    },
    {
      provide: MJML_PROVIDER_TOKEN,
      useFactory: (configService: ConfigService) => {
        const appConfig: IAppConfig = configService.get<IAppConfig>('app');
        return new MJMLProvider(appConfig);
      },
      inject: [ConfigService],
    },
    {
      provide: MONGODB_PROVIDER_TOKEN,
      useFactory: (configService: ConfigService): MongodbProvider => {
        const mongodbConfig: IMongodbConfig =
          configService.get<IMongodbConfig>('mongodb');

        return new MongodbProvider(mongodbConfig);
      },
      inject: [ConfigService],
    },
    {
      provide: SENDGRID_PROVIDER_TOKEN,
      useFactory: (
        configService: ConfigService,
        mjmlProvider: MJMLProvider,
      ): SendGridProvider => {
        const sendgridConfig: ISendGridConfig =
          configService.get<ISendGridConfig>('sendgrid');

        return new SendGridProvider(sendgridConfig, mjmlProvider);
      },
      inject: [ConfigService, MJML_PROVIDER_TOKEN],
    },
    {
      provide: CryptoTokenRepository,
      useClass: CryptoTokenMongodbRepository,
    },
    {
      provide: OtpRepository,
      useClass: OtpRedisRepository,
    },
    {
      provide: TemporaryCodeRepository,
      useClass: TemporaryCodeRedisRepository,
    },
    {
      provide: AuthTokensBlacklistRepository,
      useClass: AuthTokensBlacklistRedisRepository,
    },
    {
      provide: BlockchainService,
      useClass: BlockchainEthersService,
    },
    {
      provide: OtpService,
      useFactory: (
        sendGridProvider: SendGridProvider,
        otpRepository: OtpRepository,
        configService: ConfigService,
      ): OtpSendgridService => {
        const authConfig: IAuthConfig = configService.get<IAuthConfig>('auth');
        if (authConfig.otpEmulationMode) {
          return new OtpEmulationService(sendGridProvider, otpRepository);
        }
        return new OtpSendgridService(sendGridProvider, otpRepository);
      },
      inject: [SENDGRID_PROVIDER_TOKEN, OtpRepository, ConfigService],
    },
    {
      provide: AuthTokenService,
      useClass: AuthTokenJwtService,
    },
    {
      provide: OtpConfirmUseCase,
      useFactory: (
        otpService: OtpService,
        authTokenService: AuthTokenService,
        otpRepository: OtpRepository,
      ) => new OtpConfirmUseCase(otpService, authTokenService, otpRepository),
      inject: [OtpService, AuthTokenService, OtpRepository],
    },
    {
      provide: LoginUseCase,
      useFactory: (otpService: OtpService) => new LoginUseCase(otpService),
      inject: [OtpService],
    },
    {
      provide: RefreshTokensUseCase,
      useFactory: (
        authTokenService: AuthTokenService,
        authTokensBlacklistRepository: AuthTokensBlacklistRepository,
      ) =>
        new RefreshTokensUseCase(
          authTokenService,
          authTokensBlacklistRepository,
        ),
      inject: [AuthTokenService, AuthTokensBlacklistRepository],
    },
    {
      provide: SynchronizeTokensUseCase,
      useFactory: (
        blockchainService: BlockchainService,
        сryptoTokenRepository: CryptoTokenRepository,
      ) =>
        new SynchronizeTokensUseCase(blockchainService, сryptoTokenRepository),
      inject: [BlockchainService, CryptoTokenRepository],
    },
    {
      provide: SubscribeOnTransferUseCase,
      useFactory: (blockchainService: BlockchainService) =>
        new SubscribeOnTransferUseCase(blockchainService),
      inject: [BlockchainService],
    },
    {
      provide: UpdateTokenOwnerUseCase,
      useFactory: (сryptoTokenRepository: CryptoTokenRepository) =>
        new UpdateTokenOwnerUseCase(сryptoTokenRepository),
      inject: [CryptoTokenRepository],
    },
    {
      provide: GetCryptoTokenByIdUseCase,
      useFactory: (сryptoTokenRepository: CryptoTokenRepository) =>
        new GetCryptoTokenByIdUseCase(сryptoTokenRepository),
      inject: [CryptoTokenRepository],
    },
    {
      provide: GetCryptoTokensListUseCase,
      useFactory: (сryptoTokenRepository: CryptoTokenRepository) =>
        new GetCryptoTokensListUseCase(сryptoTokenRepository),
      inject: [CryptoTokenRepository],
    },
    SynchronizeWorker,
    LoginResolver,
    RefreshAuthTokenResolver,
    TokenByIdResolver,
    TokensListResolver,
    VerifyResolver,
  ],
})
export class AppModule {}
