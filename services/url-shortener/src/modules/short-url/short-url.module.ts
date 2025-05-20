import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { ShortUrlController } from './adapters/controllers/short-url.controller';
import {
  CLICK_COUNT_SERVICE,
  SHORT_URL_REPOSITORY,
  URL_FORMATTER,
} from './core/constants/injection-tokens';
import { CreateShortUrlUseCase } from './core/use-cases/create-short-url.use-case';
import { DeleteShortUrlUseCase } from './core/use-cases/delete-short-url.use-case';
import { GetOriginalUrlUseCase } from './core/use-cases/get-original-url.use-case';
import { IncrementUrlClickCountUseCase } from './core/use-cases/increment-url-click-count.use-case';
import { ListShortUrlsUseCase } from './core/use-cases/list-short-urls.use-case';
import { UpdateShortUrlUseCase } from './core/use-cases/update-short-url.use-case';
import { ShortUrlEntity } from './infrastructure/entities/short-url.entity';
import { TypeOrmShortUrlRepository } from './infrastructure/repositories/short-url.repository';
import { ClickCountService } from './infrastructure/services/click-count.service';
import { UrlFormatterService } from './infrastructure/services/url-formatter.service';
import { ClickQueueProcessor } from './infrastructure/processors/click-queue.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShortUrlEntity]),
    BullModule.registerQueue({
      name: 'click-queue',
    }),
  ],
  controllers: [ShortUrlController],
  providers: [
    {
      provide: SHORT_URL_REPOSITORY,
      useClass: TypeOrmShortUrlRepository,
    },
    {
      provide: URL_FORMATTER,
      useClass: UrlFormatterService,
    },
    {
      provide: CLICK_COUNT_SERVICE,
      useClass: ClickCountService,
    },
    ClickQueueProcessor,
    CreateShortUrlUseCase,
    GetOriginalUrlUseCase,
    ListShortUrlsUseCase,
    UpdateShortUrlUseCase,
    DeleteShortUrlUseCase,
    IncrementUrlClickCountUseCase,
  ],
  exports: [SHORT_URL_REPOSITORY],
})
export class ShortUrlModule {}
