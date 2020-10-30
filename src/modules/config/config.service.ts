import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

import { PGConfigService } from './PGConfigService';
import { IDBConfig, IGooglePassportConfig } from './interfaces';
import { ExtractJwt } from "passport-jwt";

const ext = path.extname(__filename);
const dbDir = path.relative(process.cwd(), path.resolve(`${__dirname}/../../db`));

const AUTH_JWT_TOKEN_EXPIRES_IN = 'AUTH_JWT_TOKEN_EXPIRES_IN';
const AUTH_JWT_SECRET = 'AUTH_JWT_SECRET';
const GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID';
const GOOGLE_SECRET = 'GOOGLE_SECRET';
const GOOGLE_REDIRECT_URL = 'GOOGLE_REDIRECT_URL';

export interface IEnvConfig {
  [key: string]: any;
}

@Injectable()
export class ConfigService {
  private static serviceInstance: ConfigService;
  private static readonly DEFAULT_NODE_ENV: string = process.env.NODE_ENV || 'local';
  private readonly envFileConfig: IEnvConfig;
  private readonly dataBaseService: IEnvConfig;

  constructor() {
    ConfigService.serviceInstance = this;

    let envFileName = `.${ConfigService.DEFAULT_NODE_ENV}.env`;
    if (!fs.existsSync(envFileName))
      envFileName = '.env';
    // const settings = dotenv.parse(fs.readFileSync(envFileName)); // TODO: Add env settings validations later
    this.envFileConfig = dotenv.parse(fs.readFileSync(envFileName));

    // this.envFileConfig = this.validateNodeEnv(settings);
    this.dataBaseService = new PGConfigService();
    //
    // this.envFileConfig = this.validateEnvFile(settings);
    // this.processConfig = this.validateProcessEnv(process.env);
  }

  static get instance() {
    return ConfigService.serviceInstance;
  }

  get<T = string>(key: string, defaultValue?: any): T {
    return this.envFileConfig[key] === undefined ? defaultValue : this.envFileConfig[key];
  }

  getOrmConfig() {
    return <TypeOrmModuleOptions>{
      dropSchema: false,

      entities: [`${__dirname}/../**/*.entity${ext}`],
      migrations: [`${dbDir}/migrations/**/*${ext}`],
      cli: {
        migrationsDir: `${dbDir}/migrations`,
      },
      seeds: [`${dbDir}/seeds/**/*.seed${ext}`],
      factories: [`${dbDir}/factories/**/*.factory${ext}`],

      ...this.getDatabaseSettings(),
    };
  }

  getGooglePassportConfig(): IGooglePassportConfig {
    return {
      clientID: this.get<string>(GOOGLE_CLIENT_ID),
      clientSecret: this.get<string>(GOOGLE_SECRET),
      callbackURL: this.get<string>(GOOGLE_REDIRECT_URL),
    }
  }

  getDatabaseSettings(): IDBConfig {
    return this.dataBaseService.getConfig(this);
  }

  getAuthJwtTokenExpiresIn(): number {
    return +this.get<number>(AUTH_JWT_TOKEN_EXPIRES_IN);
  }

  getAuthJwtSecret(): string {
    return this.get<string>(AUTH_JWT_SECRET);
  }
}
