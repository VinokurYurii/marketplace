import { IDBConfig } from './IDBConfig';

export interface IPgDBConfig extends IDBConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  keepConnectionAlive: boolean;
  dropDatabaseSchema: boolean;
}
