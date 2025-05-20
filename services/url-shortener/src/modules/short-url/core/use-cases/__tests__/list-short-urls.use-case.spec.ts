import { Test } from '@nestjs/testing';

import {
  SHORT_URL_REPOSITORY,
  URL_FORMATTER,
} from '../../constants/injection-tokens';
import { ShortUrl } from '../../entities/short-url.entity';
import { IShortUrlRepository } from '../../repositories/short-url.repository.interface';
import { IUrlFormatter } from '../../services/url-formatter.interface';
import { ListShortUrlsUseCase } from '../list-short-urls.use-case';

describe('ListShortUrlsUseCase', () => {
  let useCase: ListShortUrlsUseCase;
  let shortUrlRepository: jest.Mocked<IShortUrlRepository>;
  let urlFormatter: jest.Mocked<IUrlFormatter>;

  beforeEach(async () => {
    shortUrlRepository = {
      findByUserId: jest.fn(),
      save: jest.fn(),
      findByShortCode: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      incrementClickCount: jest.fn(),
    };

    urlFormatter = {
      generateFullUrl: jest.fn(),
      generateShortCode: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ListShortUrlsUseCase,
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

    useCase = moduleRef.get<ListShortUrlsUseCase>(ListShortUrlsUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const request = {
      userId: 'user123',
      page: 1,
      limit: 10,
    };

    it('should return empty list when no URLs found', async () => {
      shortUrlRepository.findByUserId.mockResolvedValue({
        items: [],
        total: 0,
        page: request.page,
        limit: request.limit,
        totalPages: 0,
      });

      const result = await useCase.execute(request);

      expect(shortUrlRepository.findByUserId).toHaveBeenCalledWith(
        request.userId,
        request.page,
        request.limit,
      );
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(request.page);
      expect(result.limit).toBe(request.limit);
      expect(result.totalPages).toBe(0);
    });

    it('should return list of URLs when found', async () => {
      const shortUrl = new ShortUrl(
        '1',
        'abc123',
        'https://example.com',
        request.userId,
        0,
        new Date(),
        new Date(),
      );

      urlFormatter.generateFullUrl.mockReturnValue(
        'http://localhost:3000/abc123',
      );

      shortUrlRepository.findByUserId.mockResolvedValue({
        items: [shortUrl],
        total: 1,
        page: request.page,
        limit: request.limit,
        totalPages: 1,
      });

      const result = await useCase.execute(request);

      expect(shortUrlRepository.findByUserId).toHaveBeenCalledWith(
        request.userId,
        request.page,
        request.limit,
      );
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(request.page);
      expect(result.limit).toBe(request.limit);
      expect(result.totalPages).toBe(1);
    });

    it('should calculate total pages correctly', async () => {
      const items = Array(10).fill(
        new ShortUrl(
          '1',
          'abc123',
          'https://example.com',
          request.userId,
          0,
          new Date(),
          new Date(),
        ),
      );

      const total = 25;

      shortUrlRepository.findByUserId.mockResolvedValue({
        items,
        total,
        page: request.page,
        limit: request.limit,
        totalPages: 3,
      });

      const result = await useCase.execute(request);

      expect(result.total).toBe(total);
      expect(result.page).toBe(request.page);
      expect(result.limit).toBe(request.limit);
      expect(result.totalPages).toBe(3);
    });
  });
});
