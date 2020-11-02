import { dummyProviders } from '../../common/test-helper';
import { AuthController } from './auth.controller';
import {Test, TestingModule} from "@nestjs/testing";

describe('AuthController', () => {
  let controller: AuthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: dummyProviders('AuthController'),
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
