import { IDBConfig } from './IDBConfig';

export interface ISQlJsDBConfig extends IDBConfig {
  autoSave: boolean;
  location: string;
  dropSchema: boolean;
}
