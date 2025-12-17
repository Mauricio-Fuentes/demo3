import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from '@application/users/use-cases/create-user.usecase';
import { ValidateUserUseCase } from '@application/users/use-cases/validate-user.usecase';
import { User } from '@domain/users/entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let validateUserUseCase: jest.Mocked<ValidateUserUseCase>;

  const mockCreateUserUseCase = {
    execute: jest.fn(),
  };

  const mockValidateUserUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: ValidateUserUseCase,
          useValue: mockValidateUserUseCase,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    createUserUseCase = module.get(CreateUserUseCase);
    validateUserUseCase = module.get(ValidateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user and return primitives', async () => {
      const createUserRequest = {
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
      };

      const user = User.create({
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      const expectedPrimitives = user.toPrimitives();
      createUserUseCase.execute.mockResolvedValue(user);

      const result = await controller.create(createUserRequest);

      expect(createUserUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserRequest);
      expect(result).toEqual(expectedPrimitives);
      expect(result).toHaveProperty('id', 'user-1');
      expect(result).toHaveProperty('name', 'Mauricio');
      expect(result).toHaveProperty('email', 'mauricio@example.com');
      expect(result).toHaveProperty('status', 'ACTIVE');
      expect(result).toHaveProperty('dateRegister');
      expect(result).toHaveProperty('dateModify');
    });

    it('should return all user properties in response', async () => {
      const createUserRequest = {
        id: 'user-2',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = User.create({
        id: 'user-2',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      createUserUseCase.execute.mockResolvedValue(user);

      const result = await controller.create(createUserRequest);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('password');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('dateRegister');
      expect(result).toHaveProperty('dateModify');
    });

    it('should handle different user data', async () => {
      const createUserRequest = {
        id: 'user-3',
        name: 'Another User',
        email: 'another@example.com',
        password: 'differentpass',
      };

      const user = User.create({
        id: 'user-3',
        name: 'Another User',
        email: 'another@example.com',
        password: 'differentpass',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      createUserUseCase.execute.mockResolvedValue(user);

      const result = await controller.create(createUserRequest);

      expect(result.id).toBe('user-3');
      expect(result.name).toBe('Another User');
      expect(result.email).toBe('another@example.com');
    });

    it('should pass request body directly to use case', async () => {
      const createUserRequest = {
        id: 'user-4',
        name: 'Direct Test',
        email: 'direct@example.com',
        password: 'directpass',
      };

      const user = User.create({
        id: 'user-4',
        name: 'Direct Test',
        email: 'direct@example.com',
        password: 'directpass',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      createUserUseCase.execute.mockResolvedValue(user);

      await controller.create(createUserRequest);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-4',
          name: 'Direct Test',
          email: 'direct@example.com',
          password: 'directpass',
        }),
      );
    });
  });

  describe('validate', () => {
    it('should validate user credentials and return tokens', async () => {
      const validateUserRequest = {
        email: 'mauricio@example.com',
        password: 'secreto123',
      };

      const expectedTokens = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'def50200a1b2c3...',
        scope: 'openid profile email',
      };

      validateUserUseCase.execute.mockResolvedValue(expectedTokens);

      const result = await controller.validate(validateUserRequest);

      expect(validateUserUseCase.execute).toHaveBeenCalledTimes(1);
      expect(validateUserUseCase.execute).toHaveBeenCalledWith(validateUserRequest);
      expect(result).toEqual(expectedTokens);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('token_type', 'Bearer');
      expect(result).toHaveProperty('expires_in', 3600);
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('scope', 'openid profile email');
    });

    it('should return all token properties when validation succeeds', async () => {
      const validateUserRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedTokens = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
        scope: 'openid profile email',
      };

      validateUserUseCase.execute.mockResolvedValue(expectedTokens);

      const result = await controller.validate(validateUserRequest);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('token_type');
      expect(result).toHaveProperty('expires_in');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('scope');
    });
  });
});

