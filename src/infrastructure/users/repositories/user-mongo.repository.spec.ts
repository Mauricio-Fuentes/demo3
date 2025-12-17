import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMongoRepository } from './user-mongo.repository';
import { UserDocument } from '../schemas/user.schema';
import { User } from '@domain/users/entities/user.entity';

describe('UserMongoRepository', () => {
  let repository: UserMongoRepository;
  let userModel: jest.Mocked<Model<UserDocument>>;

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMongoRepository,
        {
          provide: getModelToken(UserDocument.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    repository = module.get<UserMongoRepository>(UserMongoRepository);
    userModel = module.get(getModelToken(UserDocument.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user in MongoDB and return User entity', async () => {
      const user = User.create({
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      const mockDocument = {
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
        status: 'ACTIVE',
        scope: 'openid profile email',
        dateRegister: user.dateRegister,
        dateModify: null,
        _id: 'mock-id',
        __v: 0,
      } as any;

      userModel.create.mockResolvedValue(mockDocument as any);

      const result = await repository.create(user);

      expect(userModel.create).toHaveBeenCalledTimes(1);
      expect(userModel.create).toHaveBeenCalledWith({
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
        status: 'ACTIVE',
        scope: 'openid profile email',
        dateRegister: user.dateRegister,
        dateModify: null,
      });
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('user-1');
      expect(result.name).toBe('Mauricio');
      expect(result.email).toBe('mauricio@example.com');
    });

    it('should handle dateModify when it exists', async () => {
      const dateModify = new Date('2024-01-02');
      const user = User.rehydrate({
        id: 'user-2',
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
        status: 'ACTIVE',
        scope: 'openid profile email',
        dateRegister: new Date('2024-01-01'),
        dateModify,
      });

      const mockDocument = {
        id: 'user-2',
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
        status: 'ACTIVE',
        dateRegister: new Date('2024-01-01'),
        dateModify,
        _id: 'mock-id',
        __v: 0,
      } as any;

      userModel.create.mockResolvedValue(mockDocument as any);

      const result = await repository.create(user);

      expect(result.dateModify).toEqual(dateModify);
    });
  });

  describe('findById', () => {
    it('should find user by id and return User entity', async () => {
      const mockDocument = {
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
        status: 'ACTIVE',
        scope: 'openid profile email',
        dateRegister: new Date('2024-01-01'),
        dateModify: null,
        exec: jest.fn().mockResolvedValue({
          id: 'user-1',
          name: 'Mauricio',
          email: 'mauricio@example.com',
          password: 'secreto123',
          status: 'ACTIVE',
          scope: 'openid profile email',
          dateRegister: new Date('2024-01-01'),
          dateModify: null,
        }),
      } as any;

      userModel.findOne.mockReturnValue(mockDocument);

      const result = await repository.findById('user-1');

      expect(userModel.findOne).toHaveBeenCalledWith({ id: 'user-1' });
      expect(mockDocument.exec).toHaveBeenCalled();
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe('user-1');
      expect(result?.name).toBe('Mauricio');
    });

    it('should return null when user is not found', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      } as any;

      userModel.findOne.mockReturnValue(mockQuery);

      const result = await repository.findById('non-existent');

      expect(userModel.findOne).toHaveBeenCalledWith({ id: 'non-existent' });
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email and return User entity', async () => {
      const mockDocument = {
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
        status: 'ACTIVE',
        scope: 'openid profile email',
        dateRegister: new Date('2024-01-01'),
        dateModify: null,
        exec: jest.fn().mockResolvedValue({
          id: 'user-1',
          name: 'Mauricio',
          email: 'mauricio@example.com',
          password: 'secreto123',
          status: 'ACTIVE',
          scope: 'openid profile email',
          dateRegister: new Date('2024-01-01'),
          dateModify: null,
        }),
      } as any;

      userModel.findOne.mockReturnValue(mockDocument);

      const result = await repository.findByEmail('mauricio@example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'mauricio@example.com',
      });
      expect(mockDocument.exec).toHaveBeenCalled();
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe('user-1');
      expect(result?.email).toBe('mauricio@example.com');
    });

    it('should return null when user is not found by email', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      } as any;

      userModel.findOne.mockReturnValue(mockQuery);

      const result = await repository.findByEmail('notfound@example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'notfound@example.com',
      });
      expect(result).toBeNull();
    });

    it('should handle dateModify when it exists', async () => {
      const dateModify = new Date('2024-01-02');
      const mockDocument = {
        id: 'user-2',
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
        status: 'ACTIVE',
        scope: 'openid profile email',
        dateRegister: new Date('2024-01-01'),
        dateModify,
        exec: jest.fn().mockResolvedValue({
          id: 'user-2',
          name: 'Test',
          email: 'test@example.com',
          password: 'password',
          status: 'ACTIVE',
          scope: 'openid profile email',
          dateRegister: new Date('2024-01-01'),
          dateModify,
        }),
      } as any;

      userModel.findOne.mockReturnValue(mockDocument);

      const result = await repository.findByEmail('test@example.com');

      expect(result?.dateModify).toEqual(dateModify);
    });
  });
});

