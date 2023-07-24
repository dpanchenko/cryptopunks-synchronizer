import { IsString } from 'class-validator';

export interface IMongodbConfig {
  connectionString: string;
}

export class MongodbConfigValidator implements IMongodbConfig {
  @IsString()
  readonly connectionString!: string;
}

export const getMongodbConfig = (): IMongodbConfig => ({
  connectionString: process.env.MONGODB_CONNECTION_STRING ?? 'localhost',
});
