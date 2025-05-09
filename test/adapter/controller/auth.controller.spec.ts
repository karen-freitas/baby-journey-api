import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../../src/domain/service/auth.service';
import { AuthController } from '../../../src/adapter/controller/auth.controller';

describe('AuthController', () => {
  let app: INestApplication;
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn().mockResolvedValue({
              accessToken: 'test-token',
            }),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
  jest.restoreAllMocks();
});

  it('should return an access token on successful login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      accessToken: 'test-token',
    });
  });

  it('should call AuthService.signIn with correct parameters', async () => {
    const email = 'test@example.com';
    const password = 'password';

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(HttpStatus.OK);

    expect(authService.signIn).toHaveBeenCalledWith(email, password);
  });


  afterAll(async () => {
    await app.close();
  });
});