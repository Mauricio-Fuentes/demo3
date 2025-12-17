import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidateUserUseCase } from './validate-user.usecase';
import { USER_REPOSITORY, UserRepository } from '@domain/users/repositories/user.repository';
import { PasswordService } from '@shared/services/password.service';
import { JwtTokenService } from '@shared/services/jwt.service';
import { User } from '@domain/users/entities/user.entity';
import { ValidateUserDto } from '../dto/validate-user.dto';

describe('ValidateUserUseCase', () => {
  let useCase: ValidateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordService: jest.Mocked<PasswordService>;
  let jwtTokenService: JwtTokenService;

  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockPasswordService = {
    hashPassword: jest.fn(),
    comparePassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        JwtTokenService,
      ],
    }).compile();

    useCase = module.get<ValidateUserUseCase>(ValidateUserUseCase);
    userRepository = module.get(USER_REPOSITORY);
    passwordService = module.get(PasswordService);
    jwtTokenService = module.get(JwtTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tokens when credentials are valid', async () => {
      const validateUserDto: ValidateUserDto = {
        email: 'mauricio@example.com',
        password: 'secreto123',
      };

      const hashedPassword = '$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012';
      const user = User.create({
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: hashedPassword,
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      const expectedTokens = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'def50200a1b2c3...',
        scope: 'openid profile email',
      };

      userRepository.findByEmail.mockResolvedValue(user);
      passwordService.comparePassword.mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce(expectedTokens.access_token)
        .mockReturnValueOnce(expectedTokens.refresh_token);

      const result = await useCase.execute(validateUserDto);

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledWith('mauricio@example.com');
      expect(passwordService.comparePassword).toHaveBeenCalledTimes(1);
      expect(passwordService.comparePassword).toHaveBeenCalledWith(
        'secreto123',
        hashedPassword,
      );
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('token_type', 'Bearer');
      expect(result).toHaveProperty('expires_in', 3600);
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('scope', 'openid profile email');
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      const validateUserDto: ValidateUserDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      userRepository.findByEmail.mockResolvedValue(null);

      try {
        await useCase.execute(validateUserDto);
        fail('Should have thrown UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        const unauthorizedError = error as UnauthorizedException;
        expect(unauthorizedError.getStatus()).toBe(401);
        expect(unauthorizedError.getResponse()).toMatchObject({
          statusCode: 401,
          message: 'Credenciales inválidas',
        });
      }

      expect(userRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(passwordService.comparePassword).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const validateUserDto: ValidateUserDto = {
        email: 'mauricio@example.com',
        password: 'wrongpassword',
      };

      const hashedPassword = '$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012';
      const user = User.create({
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: hashedPassword,
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      userRepository.findByEmail.mockResolvedValue(user);
      passwordService.comparePassword.mockResolvedValue(false);

      try {
        await useCase.execute(validateUserDto);
        fail('Should have thrown UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        const unauthorizedError = error as UnauthorizedException;
        expect(unauthorizedError.getStatus()).toBe(401);
        expect(unauthorizedError.getResponse()).toMatchObject({
          statusCode: 401,
          message: 'Credenciales inválidas',
        });
      }

      expect(userRepository.findByEmail).toHaveBeenCalledWith('mauricio@example.com');
      expect(passwordService.comparePassword).toHaveBeenCalledWith(
        'wrongpassword',
        hashedPassword,
      );
    });

    it('should validate user with different email and return tokens', async () => {
      const validateUserDto: ValidateUserDto = {
        email: 'test@example.com',
        password: 'testpass',
      };

      const hashedPassword = '$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012';
      const user = User.create({
        id: 'user-2',
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      const expectedTokens = {
        access_token: 'token-for-test-user',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refresh-token-for-test-user',
        scope: 'openid profile email',
      };

      userRepository.findByEmail.mockResolvedValue(user);
      passwordService.comparePassword.mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce(expectedTokens.access_token)
        .mockReturnValueOnce(expectedTokens.refresh_token);

      const result = await useCase.execute(validateUserDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.token_type).toBe('Bearer');
      expect(result.expires_in).toBe(3600);
      expect(result.scope).toBe('openid profile email');
    });
  });
});

