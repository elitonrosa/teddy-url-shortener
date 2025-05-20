import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { IClickCountService } from '../../core/services/click-count.service.interface';

@Injectable()
export class ClickCountService implements IClickCountService {
  private readonly logger = new Logger(ClickCountService.name);
  private static readonly CLICK_QUEUE = 'click-queue';
  private static readonly BATCH_SIZE = 100;
  private static readonly BATCH_INTERVAL = 20_000;
  private clickBuffer: { shortCode: string }[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(
    @InjectQueue(ClickCountService.CLICK_QUEUE)
    private readonly clickQueue: Queue,
  ) {}

  async incrementClickCount(shortCode: string): Promise<void> {
    try {
      this.clickBuffer.push({ shortCode });

      if (this.clickBuffer.length >= ClickCountService.BATCH_SIZE) {
        await this.processBatch(this.clickBuffer);
        this.clickBuffer = [];
        this.clearBatchTimeout();
      } else if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(async () => {
          if (this.clickBuffer.length > 0) {
            await this.processBatch(this.clickBuffer);
            this.clickBuffer = [];
          }
          this.clearBatchTimeout();
        }, ClickCountService.BATCH_INTERVAL);
      }
    } catch (error) {
      this.logger.error(`Add click error ${shortCode}:`, error);
      throw error;
    }
  }

  private clearBatchTimeout(): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }

  private async processBatch(clicks: { shortCode: string }[]): Promise<void> {
    try {
      const clickCounts = new Map<string, number>();

      clicks.forEach(({ shortCode }) => {
        const count = clickCounts.get(shortCode) || 0;
        clickCounts.set(shortCode, count + 1);
      });

      for (const [shortCode, count] of clickCounts) {
        await this.clickQueue.add(
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
      }
    } catch (error) {
      this.logger.error('Process batch error:', error);
      throw error;
    }
  }
}
