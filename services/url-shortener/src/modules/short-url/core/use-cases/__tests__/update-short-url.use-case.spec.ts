import { Test } from '@nestjs/testing';

import { SHORT_URL_REPOSITORY } from '../../constants/injection-tokens';
import { ShortUrl } from '../../entities/short-url.entity';
import {
  ShortUrlNotFoundException,
  UnauthorizedUpdateException,
} from '../../exceptions/short-url.exception';
import { IShortUrlRepository } from '../../repositories/short-url.repository.interface';
import { UpdateShortUrlUseCase } from '../update-short-url.use-case';

describe('UpdateShortUrlUseCase', () => {
  let useCase: UpdateShortUrlUseCase;
  let shortUrlRepository: jest.Mocked<IShortUrlRepository>;

  beforeEach(async () => {
    shortUrlRepository = {
      findByShortCode: jest.fn(),
      save: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      incrementClickCount: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateShortUrlUseCase,
        {
          provide: SHORT_URL_REPOSITORY,
          useValue: shortUrlRepository,
        },
      ],
    }).compile();

    useCase = moduleRef.get<UpdateShortUrlUseCase>(UpdateShortUrlUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const request = {
      shortCode: 'abc123',
      originalUrl: 'https://newexample.com',
      userId: 'user123',
    };

    it('should throw ShortUrlNotFoundException when URL not found', async () => {
      shortUrlRepository.findByShortCode.mockResolvedValue(null);

      await expect(useCase.execute(request)).rejects.toThrow(
        ShortUrlNotFoundException,
      );
      expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
        request.shortCode,
      );
      expect(shortUrlRepository.save).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedUpdateException when URL belongs to another user', async () => {
      const shortUrl = new ShortUrl(
        '1',
        request.shortCode,
        'https://example.com',
        'other-user',
        0,
        new Date(),
        new Date(),
      );
      jest.spyOn(shortUrl, 'belongsToUser').mockReturnValue(false);

      shortUrlRepository.findByShortCode.mockResolvedValue(shortUrl);

      await expect(useCase.execute(request)).rejects.toThrow(
        UnauthorizedUpdateException,
      );
      expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
        request.shortCode,
      );
      expect(shortUrl.belongsToUser).toHaveBeenCalledWith(request.userId);
      expect(shortUrlRepository.save).not.toHaveBeenCalled();
    });

    it('should update URL successfully', async () => {
      const shortUrl = new ShortUrl(
        '1',
        request.shortCode,
        'https://example.com',
        request.userId,
        0,
        new Date(),
        new Date(),
      );
      jest.spyOn(shortUrl, 'belongsToUser').mockReturnValue(true);

      shortUrlRepository.findByShortCode.mockResolvedValue(shortUrl);
      shortUrlRepository.save.mockImplementation((data) =>
        Promise.resolve(data),
      );

      await useCase.execute(request);

      expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
        request.shortCode,
      );
      expect(shortUrl.belongsToUser).toHaveBeenCalledWith(request.userId);
      expect(shortUrlRepository.save).toHaveBeenCalledWith(shortUrl);
      expect(shortUrl.originalUrl).toBe(request.originalUrl);
    });
  });
});
