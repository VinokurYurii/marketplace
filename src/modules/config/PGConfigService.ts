import { Injectable } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import {
  IConfig,
  IPropertySource,
  IPgDBConfig,
} from './interfaces';

const DATABASE_TYPE = 'DATABASE_TYPE';
const DATABASE_HOST = 'DATABASE_HOST';
const DATABASE_PORT = 'DATABASE_PORT';
const DATABASE_NAME = 'DATABASE_NAME';
const DATABASE_USERNAME = 'DATABASE_USERNAME';
const DATABASE_PASSWORD = 'DATABASE_PASSWORD';
const DATABASE_SYNCHRONIZE = 'DATABASE_SYNCHRONIZE';
const DATABASE_DROP_SCHEMA = 'DATABASE_DROP_SCHEMA';

@Injectable()
export class PGConfigService implements IConfig<IPgDBConfig> {
  getSchema(): Joi.SchemaMap {
    return {
      [DATABASE_TYPE]: Joi.string().optional(),
      [DATABASE_PORT]: Joi.number().default(5432),
      [DATABASE_HOST]: Joi.string().required(),
      [DATABASE_NAME]: Joi.string().required(),
      [DATABASE_USERNAME]: Joi.string().required(),
      [DATABASE_PASSWORD]: Joi.string().required(),
      [DATABASE_SYNCHRONIZE]: Joi.boolean().default(false),
    };
  }

  getConfig(source: IPropertySource): IPgDBConfig {
    return {
      keepConnectionAlive: true,
      type: 'postgres',
      port: source.get<number>(DATABASE_PORT),
      host: source.get(DATABASE_HOST),
      database: source.get(DATABASE_NAME),
      username: source.get(DATABASE_USERNAME),
      password: source.get(DATABASE_PASSWORD),
      synchronize: source.get<boolean>(DATABASE_SYNCHRONIZE),
      dropDatabaseSchema: source.get<boolean>(DATABASE_DROP_SCHEMA, false),
    };
  }
}
