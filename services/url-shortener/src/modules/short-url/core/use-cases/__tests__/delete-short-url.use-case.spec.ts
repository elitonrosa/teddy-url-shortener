import { Test } from '@nestjs/testing';

import { SHORT_URL_REPOSITORY } from '../../constants/injection-tokens';
import {
  ShortUrlNotFoundException,
  UnauthorizedDeleteException,
} from '../../exceptions/short-url.exception';
import { DeleteShortUrlUseCase } from '../delete-short-url.use-case';

describe('DeleteShortUrlUseCase', () => {
  let useCase: DeleteShortUrlUseCase;
  let shortUrlRepository: any;

  beforeEach(async () => {
    shortUrlRepository = {
      findByShortCode: jest.fn(),
      delete: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteShortUrlUseCase,
        {
          provide: SHORT_URL_REPOSITORY,
          useValue: shortUrlRepository,
        },
      ],
    }).compile();

    useCase = moduleRef.get<DeleteShortUrlUseCase>(DeleteShortUrlUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const request = {
      shortCode: 'abc123',
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
      expect(shortUrlRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedDeleteException when URL belongs to another user', async () => {
      const shortUrl = {
        id: '1',
        shortCode: request.shortCode,
        originalUrl: 'https://example.com',
        userId: 'other-user',
        belongsToUser: jest.fn().mockReturnValue(false),
      };

      shortUrlRepository.findByShortCode.mockResolvedValue(shortUrl);

      await expect(useCase.execute(request)).rejects.toThrow(
        UnauthorizedDeleteException,
      );
      expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
        request.shortCode,
      );
      expect(shortUrl.belongsToUser).toHaveBeenCalledWith(request.userId);
      expect(shortUrlRepository.delete).not.toHaveBeenCalled();
    });

    it('should delete URL successfully', async () => {
      const shortUrl = {
        id: '1',
        shortCode: request.shortCode,
        originalUrl: 'https://example.com',
        userId: request.userId,
        belongsToUser: jest.fn().mockReturnValue(true),
      };

      shortUrlRepository.findByShortCode.mockResolvedValue(shortUrl);
      shortUrlRepository.delete.mockResolvedValue(undefined);

      await useCase.execute(request);

      expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
        request.shortCode,
      );
      expect(shortUrl.belongsToUser).toHaveBeenCalledWith(request.userId);
      expect(shortUrlRepository.delete).toHaveBeenCalledWith(shortUrl.id);
    });
  });
});
