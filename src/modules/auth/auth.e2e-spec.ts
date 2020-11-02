import { TypeOrmModule } from '@nestjs/typeorm';

import * as faker from 'faker';

import { TestCore } from '../../common/test-helper';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User, UserRole } from '../user/user.entity';
import { SignInDTO } from './dto/signInDTO';
import { LogInDTO } from './dto/logInDTO';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let testCore = new TestCore();
  let userService: UserService;

  const userPreset = (role: UserRole, params: Partial<SignInDTO> = {}): { dto: SignInDTO, returnData } => {
    const firstName = (params.firstName || faker.name.firstName());
    const lastName = (params.lastName || faker.name.lastName());
    const phone = (params.phone || faker.phone.phoneNumber());
    const email = (params.email || faker.internet.email());
    const password = (params.password || faker.random.alphaNumeric(10));
    const passwordConfirmation = (params.passwordConfirmation || password);
    return {
      dto: { firstName, lastName, phone, email, role, password, passwordConfirmation },
      returnData: { firstName, lastName, phone, email, role }
    }
  };

  beforeAll(async () => {
    await testCore.init({
      imports: [TypeOrmModule.forFeature([User]), UserModule],
      controllers: [AuthController],
      providers: [AuthService, UserService],
    });
    userService = testCore.getControllerOrProvider<UserService>(UserService);
  });

  describe('signIn', () => {
    it('should create and return new parent', async () => {
      const { dto, returnData } = userPreset(UserRole.parent);
      return testCore
        .request()
        .post('/auth/sign-in')
        .send(dto)
        .expect(201)
        .then(({ body }) => {
          expect(body).toMatchObject(returnData);
          expect(body.password).toBe(undefined);
          expect(body.id).toBe(1);
      });
    });

    it('should create and return new businessOwner', async () => {
      const { dto, returnData } = userPreset(UserRole.businessOwner);
      return testCore
        .request()
        .post('/auth/sign-in')
        .send(dto)
        .expect(201)
        .then(({ body }) => {
          expect(body).toMatchObject(returnData);
          expect(body.password).toBe(undefined);
          expect(body.id).toBe(1);
        });
    });

    it('should not create new admin', async () => {
      const { dto } = userPreset(UserRole.admin);
      return testCore
        .request()
        .post('/auth/sign-in')
        .send(dto)
        .expect(400)
        .then(({ body }) => {
          expect(body.name).toBe('Validation Error');
          expect(body.errors.length).toBe(1);
          expect(body.errors[0].path).toContain('role');
        });
    });

    it('should not create on password and passwordConfirmation not match', async () => {
      const { dto } = userPreset(
        UserRole.businessOwner,
        {
          password: 'onePasswordString',
          passwordConfirmation: 'anotherPasswordString'
        });
      return testCore
        .request()
        .post('/auth/sign-in')
        .send(dto)
        .expect(400)
        .then(({ body }) => {
          expect(body.name).toBe('Validation Error');
          expect(body.errors.length).toBe(1);
          expect(body.errors.map(({ path }) => path)).toContain('passwordConfirmation');
        });
    });

    it('should not return all errors', async () => {
      const { dto } = userPreset(
        UserRole.admin,
        {
          password: 'onePasswordString',
          passwordConfirmation: 'anotherPasswordString'
        });
      return testCore
        .request()
        .post('/auth/sign-in')
        .send(dto)
        .expect(400)
        .then(({ body }) => {
          expect(body.name).toBe('Validation Error');
          expect(body.errors.length).toBe(2);
          const errorPaths = body.errors.map(({ path }) => path);
          expect(errorPaths).toContain('passwordConfirmation');
          expect(errorPaths).toContain('role');
        });
    });

    afterEach(async () => {
      await testCore.truncateTable('user');
    });
  });

  describe('logIn', () => {
    let user: Partial<User>;
    const password = '12345678';
    const email = 'example@com.ua';
    const { dto, returnData } = userPreset(UserRole.parent, { email, password });
    const logInData: LogInDTO = { email, password };
    const errorObject = {
      statusCode: 401,
      message: 'Wrong email or password.',
      error: 'Unauthorized'
    };

    beforeAll(async () => {
      user = await userService.create(dto);
      returnData.id = user.id;
    });

    it('Should return user data and token', async () => {
      return testCore
        .request()
        .post('/auth/login')
        .send(logInData)
        .expect(201)
        .then(({ body }) => {
          expect(body.access_token).toBeTruthy();
          expect(body.user).toMatchObject(returnData);
        });
    });

    it('Should return error on wrong password', async () => {
      logInData.password = '87654321';
      return testCore
        .request()
        .post('/auth/login')
        .send(logInData)
        .expect(401)
        .then(({ body }) => {
          expect(body.access_token).toBeUndefined();
          expect(body).toMatchObject(errorObject);
        });
    });

    it('Should return error on wrong email', async () => {
      logInData.email = 'wrong@com.ua';
      return testCore
        .request()
        .post('/auth/login')
        .send(logInData)
        .expect(401)
        .then(({ body }) => {
          expect(body.access_token).toBeUndefined();
          expect(body).toMatchObject(errorObject);
        });
    });

    afterAll(async () => {
      await testCore.truncateTable('user');
    });
  });

  afterAll(async () => {
    await testCore.close();
  })
});
