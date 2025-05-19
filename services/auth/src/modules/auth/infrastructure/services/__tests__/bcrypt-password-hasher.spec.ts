import { Test } from '@nestjs/testing';
import { BcryptPasswordHasher } from '../bcrypt-password-hasher';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('BcryptPasswordHasher', () => {
  let service: BcryptPasswordHasher;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BcryptPasswordHasher],
    }).compile();

    service = moduleRef.get<BcryptPasswordHasher>(BcryptPasswordHasher);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'password123';
      const hashedPassword = await service.hash(password);

      expect(hashedPassword).toBe('hashed-password');
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('compare', () => {
    it('should compare a password with a hash', async () => {
      const password = 'password123';
      const hash = 'hashed-password';
      const result = await service.compare(password, hash);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should return false when passwords do not match', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      const password = 'password123';
      const hash = 'wrong-hash';
      const result = await service.compare(password, hash);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });
  });
});
