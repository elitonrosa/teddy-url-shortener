import { Test } from '@nestjs/testing';

import { ShortUrlController } from '../short-url.controller';
import { CreateShortUrlUseCase } from '../../../core/use-cases/create-short-url.use-case';
import { GetOriginalUrlUseCase } from '../../../core/use-cases/get-original-url.use-case';
import { ListShortUrlsUseCase } from '../../../core/use-cases/list-short-urls.use-case';
import { UpdateShortUrlUseCase } from '../../../core/use-cases/update-short-url.use-case';
import { DeleteShortUrlUseCase } from '../../../core/use-cases/delete-short-url.use-case';
import { IncrementUrlClickCountUseCase } from '../../../core/use-cases/increment-url-click-count.use-case';
import { CreateShortUrlRequestDto } from '../../dtos/create-short-url.dto';
import { ListShortUrlsRequestDto } from '../../dtos/list-short-urls.dto';
import { ListShortUrlsResponseDto as CoreListShortUrlsResponseDto } from '../../../core/dtos/list-short-urls.dto';
import { UpdateShortUrlRequestDto } from '../../dtos/update-short-url.dto';
import { ShortUrlNotFoundException } from '../../../core/exceptions/short-url.exception';
import { ListShortUrlsResponseDto } from '../../dtos/short-url-response.dto';
import { OriginalUrlResponseDto } from '../../dtos/short-url-response.dto';
import { ShortUrlItemDto } from '../../../core/dtos/list-short-urls.dto';
import { IncrementUrlClickCountRequestDto } from '../../../core/dtos/increment-url-click-count.dto';

describe('ShortUrlController', () => {
  let controller: ShortUrlController;
  let createShortUrlUseCase: any;
  let getOriginalUrlUseCase: any;
  let listShortUrlsUseCase: any;
  let updateShortUrlUseCase: any;
  let deleteShortUrlUseCase: any;
  let incrementUrlClickCountUseCase: any;

  beforeEach(async () => {
    createShortUrlUseCase = {
      execute: jest.fn(),
    };

    getOriginalUrlUseCase = {
      execute: jest.fn(),
    };

    listShortUrlsUseCase = {
      execute: jest.fn(),
    };

    updateShortUrlUseCase = {
      execute: jest.fn(),
    };

    deleteShortUrlUseCase = {
      execute: jest.fn(),
    };

    incrementUrlClickCountUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [ShortUrlController],
      providers: [
        {
          provide: CreateShortUrlUseCase,
          useValue: createShortUrlUseCase,
        },
        {
          provide: GetOriginalUrlUseCase,
          useValue: getOriginalUrlUseCase,
        },
        {
          provide: ListShortUrlsUseCase,
          useValue: listShortUrlsUseCase,
        },
        {
          provide: UpdateShortUrlUseCase,
          useValue: updateShortUrlUseCase,
        },
        {
          provide: DeleteShortUrlUseCase,
          useValue: deleteShortUrlUseCase,
        },
        {
          provide: IncrementUrlClickCountUseCase,
          useValue: incrementUrlClickCountUseCase,
        },
      ],
    }).compile();

    controller = moduleRef.get<ShortUrlController>(ShortUrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new short URL successfully', async () => {
      const dto: CreateShortUrlRequestDto = {
        originalUrl: 'https://example.com',
      };

      const expectedResponse = {
        shortUrl: 'http://localhost:3000/abc123',
      };

      createShortUrlUseCase.execute.mockResolvedValueOnce(expectedResponse);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResponse);
      expect(createShortUrlUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('should list short URLs successfully', async () => {
      const dto: ListShortUrlsRequestDto = {
        page: 1,
        limit: 10,
      };

      const userId = 'user123';

      const executeResponseMock = new CoreListShortUrlsResponseDto(
        [
          new ShortUrlItemDto(
            'http://localhost:3000/abc123',
            'https://example.com',
            0,
            new Date('2025-05-20T05:54:05.810Z'),
            new Date('2025-05-20T05:54:05.810Z'),
          ),
        ],
        10,
        1,
        1,
        1,
      );

      const expectedResponse = new ListShortUrlsResponseDto(
        executeResponseMock.items,
        executeResponseMock.total,
        executeResponseMock.page,
        executeResponseMock.limit,
        executeResponseMock.totalPages,
      );

      listShortUrlsUseCase.execute.mockResolvedValueOnce(executeResponseMock);

      const result = await controller.list(dto, userId);

      expect(result).toEqual(expectedResponse);
      expect(listShortUrlsUseCase.execute).toHaveBeenCalledWith({
        ...dto,
        userId,
      });
    });
  });

  describe('update', () => {
    it('should update a short URL successfully', async () => {
      const shortCode = 'abc123';
      const dto: UpdateShortUrlRequestDto = {
        originalUrl: 'https://newexample.com',
      };
      const userId = 'user123';

      await controller.update(shortCode, dto, userId);

      expect(updateShortUrlUseCase.execute).toHaveBeenCalled();
    });

    it('should throw ShortUrlNotFoundException when URL not found', async () => {
      const shortCode = 'invalid';
      const dto: UpdateShortUrlRequestDto = {
        originalUrl: 'https://example.com',
      };
      const userId = 'user123';

      updateShortUrlUseCase.execute.mockRejectedValueOnce(
        new ShortUrlNotFoundException(),
      );

      await expect(controller.update(shortCode, dto, userId)).rejects.toThrow(
        ShortUrlNotFoundException,
      );
      expect(updateShortUrlUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a short URL successfully', async () => {
      const shortCode = 'abc123';
      const userId = 'user123';

      await controller.delete(shortCode, userId);

      expect(deleteShortUrlUseCase.execute).toHaveBeenCalled();
    });

    it('should throw ShortUrlNotFoundException when URL not found', async () => {
      const shortCode = 'invalid';
      const userId = 'user123';

      deleteShortUrlUseCase.execute.mockRejectedValueOnce(
        new ShortUrlNotFoundException(),
      );

      await expect(controller.delete(shortCode, userId)).rejects.toThrow(
        ShortUrlNotFoundException,
      );
      expect(deleteShortUrlUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('getOriginalUrl', () => {
    it('should get original URL and increment click count', async () => {
      const shortCode = 'abc123';
      const originalUrl = 'https://example.com';

      getOriginalUrlUseCase.execute.mockResolvedValueOnce({
        originalUrl,
      });

      const expectedResponse = new OriginalUrlResponseDto(originalUrl);

      const result = await controller.getOriginalUrl(shortCode);

      expect(result).toEqual(expectedResponse);
      expect(getOriginalUrlUseCase.execute).toHaveBeenCalledWith(
        new IncrementUrlClickCountRequestDto(shortCode),
      );
      expect(incrementUrlClickCountUseCase.execute).toHaveBeenCalledWith(
        new IncrementUrlClickCountRequestDto(shortCode),
      );
    });

    it('should throw ShortUrlNotFoundException when URL not found', async () => {
      const shortCode = 'invalid';

      getOriginalUrlUseCase.execute.mockRejectedValueOnce(
        new ShortUrlNotFoundException(),
      );

      await expect(controller.getOriginalUrl(shortCode)).rejects.toThrow(
        ShortUrlNotFoundException,
      );
      expect(getOriginalUrlUseCase.execute).toHaveBeenCalled();
      expect(incrementUrlClickCountUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
