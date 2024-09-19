import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { UsersRepository } from './users.repository';

const mockUsersRepository = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
  validateUserPassword: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository;
  let jwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('calls UsersRepository.createUser and returns void', async () => {
      usersRepository.createUser.mockResolvedValue(undefined);
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'test@test.com',
        password: 'password',
      };

      await expect(
        authService.signUp(authCredentialsDto),
      ).resolves.not.toThrow();
      expect(usersRepository.createUser).toHaveBeenCalledWith(
        authCredentialsDto,
      );
    });
  });

  describe('signIn', () => {
    const authCredentialsDto: AuthCredentialsDto = {
      email: 'test@test.com',
      password: 'password',
    };

    it('returns accessToken on valid credentials', async () => {
      const mockUser = { email: 'test@test.com', password: 'hashedpassword' };
      usersRepository.findOne.mockResolvedValue(mockUser);
      usersRepository.validateUserPassword.mockResolvedValue(true);
      jwtService.sign.mockReturnValue('mockJwtToken');

      const result = await authService.signIn(authCredentialsDto);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
      expect(usersRepository.validateUserPassword).toHaveBeenCalledWith(
        'password',
        mockUser,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(result).toEqual({ accessToken: 'mockJwtToken' });
    });

    it('throws NotFoundException when user is not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(authService.signIn(authCredentialsDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws UnauthorizedException when password is invalid', async () => {
      const mockUser = { email: 'test@test.com', password: 'hashedpassword' };
      usersRepository.findOne.mockResolvedValue(mockUser);
      usersRepository.validateUserPassword.mockResolvedValue(false);

      await expect(authService.signIn(authCredentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
