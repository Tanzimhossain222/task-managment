import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';

const mockAuthService = () => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
});

describe('AuthController', () => {
  let authController: AuthController;
  let authService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useFactory: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should call AuthService.signUp with the correct arguments', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'test@test.com',
        password: 'password',
      };
      authService.signUp.mockResolvedValue(undefined);

      await authController.signUp(authCredentialsDto);
      expect(authService.signUp).toHaveBeenCalledWith(authCredentialsDto);
    });
  });

  describe('signIn', () => {
    it('should return accessToken from AuthService.signIn', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const result = { accessToken: 'mockAccessToken' };
      authService.signIn.mockResolvedValue(result);

      const accessToken = await authController.signIn(authCredentialsDto);
      expect(authService.signIn).toHaveBeenCalledWith(authCredentialsDto);
      expect(accessToken).toEqual(result);
    });
  });
});
