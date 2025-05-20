import { Test } from '@nestjs/testing';

import {
  SHORT_URL_REPOSITORY,
  URL_FORMATTER,
} from '../../constants/injection-tokens';
import { ShortCodeCollisionException } from '../../exceptions/short-url.exception';
import { IShortUrlRepository } from '../../repositories/short-url.repository.interface';
import { IUrlFormatter } from '../../services/url-formatter.interface';
import { CreateShortUrlUseCase } from '../create-short-url.use-case';

describe('CreateShortUrlUseCase', () => {
  let useCase: CreateShortUrlUseCase;
  let shortUrlRepository: jest.Mocked<IShortUrlRepository>;
  let urlFormatter: jest.Mocked<IUrlFormatter>;

  beforeEach(async () => {
    shortUrlRepository = {
      save: jest.fn(),
      findByShortCode: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      incrementClickCount: jest.fn(),
    };

    urlFormatter = {
      generateShortCode: jest.fn(),
      generateFullUrl: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateShortUrlUseCase,
        {
          provide: SHORT_URL_REPOSITORY,
          useValue: shortUrlRepository,
        },
        {
          provide: URL_FORMATTER,
          useValue: urlFormatter,
        },
      ],
    }).compile();

    useCase = moduleRef.get<CreateShortUrlUseCase>(CreateShortUrlUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const request = {
      originalUrl: 'https://example.com',
      userId: 'user123',
    };

    it('should throw ShortCodeCollisionException when URL already exists', async () => {
      const existingShortUrl = {
        id: '1',
        shortCode: 'abc123',
        originalUrl: request.originalUrl,
        userId: request.userId,
      };

      shortUrlRepository.save.mockRejectedValue(
        new ShortCodeCollisionException(existingShortUrl.shortCode),
      );

      await expect(useCase.execute(request)).rejects.toThrow(
        ShortCodeCollisionException,
      );
      expect(urlFormatter.generateShortCode).toHaveBeenCalled();
      expect(urlFormatter.generateFullUrl).not.toHaveBeenCalled();
      expect(shortUrlRepository.save).toHaveBeenCalled();
    });

    it('should create a new short URL successfully', async () => {
      const shortCode = 'abc123';
      const shortUrl = 'http://localhost:3000/abc123';

      urlFormatter.generateShortCode.mockReturnValue(shortCode);
      urlFormatter.generateFullUrl.mockReturnValue(shortUrl);
      shortUrlRepository.save.mockImplementation((data) =>
        Promise.resolve(data),
      );

      const result = await useCase.execute(request);

      expect(urlFormatter.generateShortCode).toHaveBeenCalled();
      expect(urlFormatter.generateFullUrl).toHaveBeenCalledWith(shortCode);
      expect(shortUrlRepository.save).toHaveBeenCalled();
      expect(result.shortUrl).toBe(shortUrl);
    });
  });
});
