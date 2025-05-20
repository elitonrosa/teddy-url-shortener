import { Test } from '@nestjs/testing';

import {
  CLICK_COUNT_SERVICE,
  SHORT_URL_REPOSITORY,
} from '../../constants/injection-tokens';
import { IShortUrlRepository } from '../../repositories/short-url.repository.interface';
import { IClickCountService } from '../../services/click-count.service.interface';
import { IncrementUrlClickCountUseCase } from '../increment-url-click-count.use-case';

describe('IncrementUrlClickCountUseCase', () => {
  let useCase: IncrementUrlClickCountUseCase;
  let shortUrlRepository: jest.Mocked<IShortUrlRepository>;
  let clickCountService: jest.Mocked<IClickCountService>;

  beforeEach(async () => {
    shortUrlRepository = {
      findByShortCode: jest.fn(),
      save: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      incrementClickCount: jest.fn(),
    };

    clickCountService = {
      incrementClickCount: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        IncrementUrlClickCountUseCase,
        {
          provide: SHORT_URL_REPOSITORY,
          useValue: shortUrlRepository,
        },
        {
          provide: CLICK_COUNT_SERVICE,
          useValue: clickCountService,
        },
      ],
    }).compile();

    useCase = moduleRef.get<IncrementUrlClickCountUseCase>(
      IncrementUrlClickCountUseCase,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const request = {
      shortCode: 'abc123',
    };

    it('should increment click count successfully', async () => {
      clickCountService.incrementClickCount.mockResolvedValue(undefined);

      await useCase.execute(request);

      expect(clickCountService.incrementClickCount).toHaveBeenCalledWith(
        request.shortCode,
      );
    });
  });
});
