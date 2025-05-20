import { Test } from '@nestjs/testing';
import { UrlFormatterService } from '../url-formatter.service';
import { ConfigService } from '@nestjs/config';

jest.mock('nanoid', () => ({
  customAlphabet: () => () => 'abc123',
}));

describe('UrlFormatterService', () => {
  let service: UrlFormatterService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    configService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    } as any;

    const moduleRef = await Test.createTestingModule({
      providers: [
        UrlFormatterService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = moduleRef.get<UrlFormatterService>(UrlFormatterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateFullUrl', () => {
    it('should generate full URL with short code', () => {
      const shortCode = 'abc123';

      const result = service.generateFullUrl(shortCode);

      expect(result).toBe('http://localhost:3000/abc123');
      expect(configService.get).toHaveBeenCalledWith('api.domain');
    });
  });

  describe('generateShortCode', () => {
    it('should generate a short code', () => {
      const result = service.generateShortCode();

      expect(result).toBe('abc123');
    });
  });
});
