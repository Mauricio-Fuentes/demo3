import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('PasswordService', () => {
  let service: PasswordService;
  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password using bcrypt', async () => {
      const plainPassword = 'secreto123';
      const hashedPassword = '$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012';

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const result = await service.hashPassword(plainPassword);

      expect(mockedBcrypt.hash).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should return different hashes for the same password (salt)', async () => {
      const plainPassword = 'secreto123';
      const hash1 = '$2b$10$hash1';
      const hash2 = '$2b$10$hash2';

      mockedBcrypt.hash
        .mockResolvedValueOnce(hash1 as never)
        .mockResolvedValueOnce(hash2 as never);

      const result1 = await service.hashPassword(plainPassword);
      const result2 = await service.hashPassword(plainPassword);

      expect(result1).toBe(hash1);
      expect(result2).toBe(hash2);
      expect(result1).not.toBe(result2);
    });
  });

  describe('comparePassword', () => {
    it('should return true when password matches hash', async () => {
      const plainPassword = 'secreto123';
      const hash = '$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012';

      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.comparePassword(plainPassword, hash);

      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(plainPassword, hash);
      expect(result).toBe(true);
    });

    it('should return false when password does not match hash', async () => {
      const plainPassword = 'wrongpassword';
      const hash = '$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012';

      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.comparePassword(plainPassword, hash);

      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(plainPassword, hash);
      expect(result).toBe(false);
    });
  });
});

