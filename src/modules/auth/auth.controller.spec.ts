import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../database/models';
import { Repository } from 'typeorm';
import { DatabaseModule } from '../../database';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisterPipe } from './interfaces/register.interface';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { IDecodedAuthToken } from './guards/guard.interface.js';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let user: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule,
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    user = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
    expect(user).toBeDefined();
  });

  describe('Register', () => {
    const newUser: RegisterPipe = {
      name: 'Newton',
      email: 'new@gmail.com',
      password: '123',
    };

    let userId: number;

    beforeAll(async () => {
      const { id } = await authController.register(<RegisterPipe>newUser);

      userId = id;
    });

    it('Regiter User 1', async () => {
      expect(
        !!(await user.findOne({ where: { email: newUser.email } })),
      ).toEqual(true);
    });

    it('Regiter User 2 (User Invalid)', async () => {
      const emailInvalid = 'newdamassa@gmail.com';

      expect(
        !!(await user.findOne({ where: { email: emailInvalid } })),
      ).toEqual(false);
    });

    afterAll(async () => {
      await user.remove({ ...newUser, id: userId });
    });
  });

  describe('authenticate', () => {
    const newUser: RegisterPipe = {
      name: 'Newton',
      email: 'new@gmail.com',
      password: '123',
    };

    let userId: number;

    beforeAll(async () => {
      const { id } = await authController.register(<RegisterPipe>newUser);

      userId = id;
    });

    it('Authenticate', async () => {
      const { user, token } = await authController.authenticate({
        email: newUser.email,
        password: newUser.password,
      });

      try {
        const { id } = verify(
          token,
          process.env.JWT_SECRET,
        ) as IDecodedAuthToken;

        expect(id === user.id).toEqual(true);
      } catch (error) {}
    });

    it('Authenticate (Email Invalid)', async () => {
      const { token } = await authController.authenticate({
        email: 'newton@gmail.com',
        password: newUser.password,
      });

      try {
        verify(token, process.env.JWT_SECRET) as IDecodedAuthToken;

        expect(false).toEqual(true);
      } catch (error) {
        expect(error instanceof JsonWebTokenError).toEqual(true);
      }
    });

    it('Authenticate (Password Invalid)', async () => {
      const { token } = await authController.authenticate({
        email: newUser.email,
        password: 'abc',
      });

      try {
        verify(token, process.env.JWT_SECRET) as IDecodedAuthToken;

        expect(false).toEqual(true);
      } catch (error) {
        expect(error instanceof JsonWebTokenError).toEqual(true);
      }
    });

    afterAll(async () => {
      await user.remove({ ...newUser, id: userId });
    });
  });
});
