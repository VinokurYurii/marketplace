import * as Joi from '@hapi/joi';
import { IPropertySource } from './IPropertySource';

export interface IConfig<T> {
  getSchema(): Joi.SchemaMap;
  getConfig(source: IPropertySource): T;
}
