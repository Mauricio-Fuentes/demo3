import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.usecase';
import { USER_REPOSITORY, UserRepository } from '@domain/users/repositories/user.repository';
import { PasswordService } from '@shared/services/password.service';
import { User } from '@domain/users/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordService: jest.Mocked<PasswordService>;

  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockPasswordService = {
    hashPassword: jest.fn(),
    comparePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get(USER_REPOSITORY);
    passwordService = module.get(PasswordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a user with ACTIVE status and encrypted password', async () => {
      const createUserDto: CreateUserDto = {
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
      };

      userRepository.findById.mockResolvedValue(null);
      const hashedPassword = '$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012';
      passwordService.hashPassword.mockResolvedValue(hashedPassword);

      const createdUser = User.create({
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: hashedPassword,
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      userRepository.create.mockResolvedValue(createdUser);

      const result = await useCase.execute(createUserDto);

      expect(userRepository.findById).toHaveBeenCalledWith('user-1');
      expect(passwordService.hashPassword).toHaveBeenCalledTimes(1);
      expect(passwordService.hashPassword).toHaveBeenCalledWith('secreto123');
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-1',
          name: 'Mauricio',
          email: 'mauricio@example.com',
          password: hashedPassword,
          status: 'ACTIVE',
        }),
      );
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('user-1');
      expect(result.name).toBe('Mauricio');
      expect(result.email).toBe('mauricio@example.com');
      expect(result.password).toBe(hashedPassword);
      expect(result.status).toBe('ACTIVE');
    });

    it('should always set status to ACTIVE regardless of input', async () => {
      const createUserDto: CreateUserDto = {
        id: 'user-2',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };

      userRepository.findById.mockResolvedValue(null);
      const hashedPassword = '$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012';
      passwordService.hashPassword.mockResolvedValue(hashedPassword);

      const createdUser = User.create({
        id: 'user-2',
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      userRepository.create.mockResolvedValue(createdUser);

      const result = await useCase.execute(createUserDto);

      expect(result.status).toBe('ACTIVE');
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ACTIVE',
        }),
      );
    });

    it('should call repository with correct user entity and encrypted password', async () => {
      const createUserDto: CreateUserDto = {
        id: 'user-3',
        name: 'Another User',
        email: 'another@example.com',
        password: 'pass123',
      };

      userRepository.findById.mockResolvedValue(null);
      const hashedPassword = '$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012';
      passwordService.hashPassword.mockResolvedValue(hashedPassword);

      const createdUser = User.create({
        id: 'user-3',
        name: 'Another User',
        email: 'another@example.com',
        password: hashedPassword,
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      userRepository.create.mockResolvedValue(createdUser);

      await useCase.execute(createUserDto);

      expect(passwordService.hashPassword).toHaveBeenCalledWith('pass123');
      const callArgument = userRepository.create.mock.calls[0][0];
      expect(callArgument).toBeInstanceOf(User);
      expect(callArgument.id).toBe(createUserDto.id);
      expect(callArgument.name).toBe(createUserDto.name);
      expect(callArgument.email).toBe(createUserDto.email);
      expect(callArgument.password).toBe(hashedPassword);
      expect(callArgument.password).not.toBe(createUserDto.password);
    });

    it('should return the user created by repository', async () => {
      const createUserDto: CreateUserDto = {
        id: 'user-4',
        name: 'Final User',
        email: 'final@example.com',
        password: 'finalpass',
      };

      userRepository.findById.mockResolvedValue(null);
      const hashedPassword = '$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012';
      passwordService.hashPassword.mockResolvedValue(hashedPassword);

      const repositoryUser = User.create({
        id: 'user-4',
        name: 'Final User',
        email: 'final@example.com',
        password: hashedPassword,
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      userRepository.create.mockResolvedValue(repositoryUser);

      const result = await useCase.execute(createUserDto);

      expect(result).toBe(repositoryUser);
    });

    it('should throw ConflictException when user ID already exists', async () => {
      const createUserDto: CreateUserDto = {
        id: 'existing-user',
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
      };

      const existingUser = User.create({
        id: 'existing-user',
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'hashed',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      userRepository.findById.mockResolvedValue(existingUser);

      try {
        await useCase.execute(createUserDto);
        fail('Should have thrown ConflictException');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        const conflictError = error as ConflictException;
        expect(conflictError.getStatus()).toBe(409);
        expect(conflictError.getResponse()).toMatchObject({
          statusCode: 409,
          message: "El usuario con ID 'existing-user' ya existe",
        });
      }

      expect(userRepository.findById).toHaveBeenCalledWith('existing-user');
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(passwordService.hashPassword).not.toHaveBeenCalled();
    });
  });
});

