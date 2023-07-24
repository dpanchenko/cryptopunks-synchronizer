import { Db, MongoClient } from 'mongodb';

import { IMongodbConfig } from '../../../config';

export class MongodbProvider {
  private db: Db;

  constructor(private readonly mongodbConfig: IMongodbConfig) {
    const client = new MongoClient(mongodbConfig.connectionString);
    client.connect();
    this.db = client.db();
  }

  public getDb(): Db {
    return this.db;
  }
}
