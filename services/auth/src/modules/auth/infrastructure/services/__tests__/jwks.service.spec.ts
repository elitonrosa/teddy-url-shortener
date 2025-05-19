import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwksService } from '../jwks.service';

jest.mock('crypto', () => ({
  createPublicKey: jest.fn().mockReturnValue('mock-key'),
}));

jest.mock('jose', () => ({
  exportJWK: jest.fn().mockResolvedValue({
    kty: 'RSA',
    n: 'mock-n',
    e: 'mock-e',
  }),
}));

describe('JwksService', () => {
  let service: JwksService;
  let configService: any;

  const mockPublicKey = 'mock-public-key';

  beforeEach(async () => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue(mockPublicKey),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        JwksService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = moduleRef.get<JwksService>(JwksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getJwks', () => {
    it('should return JWKS with correct structure', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = await service.getJwks();

      expect(result).toHaveProperty('keys');
      expect(Array.isArray(result.keys)).toBe(true);
      expect(result.keys[0]).toHaveProperty('kid', 'auth-key-1');
      expect(result.keys[0]).toHaveProperty('kty', 'RSA');
      expect(result.keys[0]).toHaveProperty('alg', 'RS256');
      expect(result.keys[0]).toHaveProperty('use', 'sig');
      expect(result.keys[0]).toHaveProperty('n', 'mock-n');
      expect(result.keys[0]).toHaveProperty('e', 'mock-e');
    });
  });
});
