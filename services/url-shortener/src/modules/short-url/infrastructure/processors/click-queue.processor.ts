import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Inject } from '@nestjs/common';
import { SHORT_URL_REPOSITORY } from '../../core/constants/injection-tokens';
import { IShortUrlRepository } from '../../core/repositories/short-url.repository.interface';

@Processor('click-queue')
export class ClickQueueProcessor {
  private readonly logger = new Logger(ClickQueueProcessor.name);

  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  @Process('batch-increment')
  async handleBatchIncrement(
    job: Job<{ shortCode: string; count: number }>,
  ): Promise<void> {
    try {
      const { shortCode, count } = job.data;
      await this.shortUrlRepository.incrementClickCount(shortCode, count);
    } catch (error) {
      this.logger.error(`Increment batch error ${job.data.shortCode}:`, error);
      throw error;
    }
  }
}
