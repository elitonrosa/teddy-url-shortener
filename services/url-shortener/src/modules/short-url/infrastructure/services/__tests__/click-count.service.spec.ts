import { Test } from '@nestjs/testing';
import { ClickCountService } from '../click-count.service';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';

jest.useFakeTimers();

describe('ClickCountService', () => {
  let service: ClickCountService;
  let clickQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    clickQueue = {
      add: jest.fn(),
    } as any;

    const moduleRef = await Test.createTestingModule({
      providers: [
        ClickCountService,
        {
          provide: getQueueToken('click-queue'),
          useValue: clickQueue,
        },
      ],
    }).compile();

    service = moduleRef.get<ClickCountService>(ClickCountService);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('incrementClickCount', () => {
    it('should process batch immediately when buffer is full', async () => {
      const shortCode = 'abc123';
      const batchSize = 100;

      for (let i = 0; i < batchSize; i++) {
        await service.incrementClickCount(shortCode);
      }

      expect(clickQueue.add).toHaveBeenCalledWith(
        'batch-increment',
        { shortCode, count: batchSize },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      );
    });

    it('should process batch after timeout when buffer is not full', async () => {
      const shortCode = 'abc123';
      const count = 5;

      for (let i = 0; i < count; i++) {
        await service.incrementClickCount(shortCode);
      }

      expect(clickQueue.add).not.toHaveBeenCalled();

      jest.advanceTimersByTime(20000);

      expect(clickQueue.add).toHaveBeenCalledWith(
        'batch-increment',
        { shortCode, count },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      );
    });

    it('should aggregate clicks for the same shortCode', async () => {
      const shortCode1 = 'abc123';
      const shortCode2 = 'def456';
      const count1 = 3;
      const count2 = 2;

      for (let i = 0; i < count1; i++) {
        await service.incrementClickCount(shortCode1);
      }

      for (let i = 0; i < count2; i++) {
        await service.incrementClickCount(shortCode2);
      }

      jest.advanceTimersByTime(20000);

      const calls = clickQueue.add.mock.calls;
      expect(calls).toHaveLength(1);
      expect(calls[0][1]).toEqual({ shortCode: shortCode1, count: count1 });
    });
  });
});
