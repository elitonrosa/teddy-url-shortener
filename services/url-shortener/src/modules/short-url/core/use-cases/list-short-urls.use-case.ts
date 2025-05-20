import { Inject, Injectable } from '@nestjs/common';

import { UnauthorizedListException } from 'src/modules/short-url/core/exceptions/short-url.exception';
import {
  SHORT_URL_REPOSITORY,
  URL_FORMATTER,
} from '../constants/injection-tokens';
import {
  ListShortUrlsRequestDto,
  ListShortUrlsResponseDto,
  ShortUrlItemDto,
} from '../dtos/list-short-urls.dto';
import { IShortUrlRepository } from '../repositories/short-url.repository.interface';
import { IUrlFormatter } from '../services/url-formatter.interface';

@Injectable()
export class ListShortUrlsUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
    @Inject(URL_FORMATTER)
    private readonly urlFormatter: IUrlFormatter,
  ) {}

  async execute(
    request: ListShortUrlsRequestDto,
  ): Promise<ListShortUrlsResponseDto> {
    const { page, limit, userId } = request;

    if (!userId) {
      throw new UnauthorizedListException();
    }

    const result = await this.shortUrlRepository.findByUserId(
      userId,
      page,
      limit,
    );

    const items = result.items.map(
      (shortUrl) =>
        new ShortUrlItemDto(
          this.urlFormatter.generateFullUrl(shortUrl.shortCode),
          shortUrl.originalUrl,
          shortUrl.clickCount,
          shortUrl.createdAt,
          shortUrl.updatedAt,
        ),
    );

    return new ListShortUrlsResponseDto(
      items,
      result.page,
      result.limit,
      result.total,
      result.totalPages,
    );
  }
}
