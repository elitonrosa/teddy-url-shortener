import { Test } from '@nestjs/testing';

import { SHORT_URL_REPOSITORY } from '../../constants/injection-tokens';
import { ShortUrlNotFoundException } from '../../exceptions/short-url.exception';
import { GetOriginalUrlUseCase } from '../get-original-url.use-case';

describe('GetOriginalUrlUseCase', () => {
  let useCase: GetOriginalUrlUseCase;
  let shortUrlRepository: any;

  beforeEach(async () => {
    shortUrlRepository = {
      findByShortCode: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetOriginalUrlUseCase,
        {
          provide: SHORT_URL_REPOSITORY,
          useValue: shortUrlRepository,
        },
      ],
    }).compile();

    useCase = moduleRef.get<GetOriginalUrlUseCase>(GetOriginalUrlUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const request = {
      shortCode: 'abc123',
    };

    it('should throw ShortUrlNotFoundException when URL not found', async () => {
      shortUrlRepository.findByShortCode.mockResolvedValue(null);

      await expect(useCase.execute(request)).rejects.toThrow(
        ShortUrlNotFoundException,
      );
      expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
        request.shortCode,
      );
    });

    it('should return original URL when found', async () => {
      const shortUrl = {
        id: '1',
        shortCode: request.shortCode,
        originalUrl: 'https://example.com',
        userId: 'user123',
      };

      shortUrlRepository.findByShortCode.mockResolvedValue(shortUrl);

      const result = await useCase.execute(request);

      expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
        request.shortCode,
      );
      expect(result.originalUrl).toBe(shortUrl.originalUrl);
    });
  });
});
