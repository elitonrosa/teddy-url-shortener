import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtTokenGenerator } from '../jwt-token-generator';
import { JwtService } from '@nestjs/jwt';

jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    setSubject: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock-token'),
  })),
}));

describe('JwtTokenGenerator', () => {
  let service: JwtTokenGenerator;
  let configService: any;
  let jwtService: any;

  beforeEach(async () => {
    configService = {
      getOrThrow: jest.fn().mockImplementation((key: string) => {
        const config = {
          'jwt.privateKey': 'mock-private-key',
          'jwt.expiresIn': '1h',
          'jwt.algorithm': 'RS256',
        };
        return config[key];
      }),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-token'),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtTokenGenerator,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = moduleRef.get<JwtTokenGenerator>(JwtTokenGenerator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('should generate a JWT token with correct payload', async () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
      };

      const token = await service.generate(payload);

      expect(token).toBe('mock-token');
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        privateKey: 'mock-private-key',
        algorithm: 'RS256',
        keyid: 'auth-key-1',
      });
      expect(configService.getOrThrow).toHaveBeenCalledWith('jwt.privateKey');
      expect(configService.getOrThrow).toHaveBeenCalledWith('jwt.algorithm');
    });
  });
});
