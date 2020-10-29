import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';

import { Connection } from 'typeorm';
import * as request from 'supertest';

import { ConfigService } from '../modules/config/config.service';

export class TestCore {
  private moduleFixture: TestingModule;
  private app: INestApplication;

  async init(metadata: ModuleMetadata, withDatabase: boolean = true) {
    const configService = new ConfigService();

    this.moduleFixture = await Test.createTestingModule({
      imports: [
        ...(
          withDatabase ?
            [TypeOrmModule.forRoot(configService.getOrmConfig())] : []
        ),
        JwtModule.register({
          secret: configService.getAuthJwtSecret(),
          signOptions: {
            expiresIn: configService.getAuthJwtTokenExpiresIn()
          }
        }),
        ...(metadata.imports || []),
        // PassportModule.register({ defaultStrategy: 'jwt' }),
      ],

      controllers: metadata.controllers,

      providers: [
        { provide: ConfigService, useValue: configService },
        // mockJwtStrategyProvider,

        ...(metadata.providers || []),
      ],
    })
      .compile();

    this.app = this.moduleFixture.createNestApplication();
    this.app.useGlobalInterceptors(new ClassSerializerInterceptor(this.app.get(Reflector)));

    await this.app.init();
  }

  getControllerOrProvider<T>(controllerOrProvider) {
    return this.getApp().get<T>(controllerOrProvider);
  }

  getConnection() {
    return this.app.get(Connection);
  }

  truncateTable(tableName: string) {
    return this.getConnection().query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY`);
  }

  close() {
    return this.app.close();
  }

  getApp() {
    return this.app;
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  request() {
    return request(this.getHttpServer())
  }
}

export const dummyProviders = (...providers) => providers.map(provider => {
  if(typeof provider === 'string') {
    return {
      provide: provider,
      useValue: {}
    }
  }
  else {
    const { name: provide, value: useValue }: { name: string, value: any } = provider;
    return { provide, useValue };
  }
});
