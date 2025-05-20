import { Inject, Injectable } from '@nestjs/common';

import {
  SHORT_URL_REPOSITORY,
  URL_FORMATTER,
} from '../constants/injection-tokens';
import {
  CreateShortUrlRequestDto,
  CreateShortUrlResponseDto,
} from '../dtos/create-short-url.dto';
import { ShortUrl } from '../entities/short-url.entity';
import { IShortUrlRepository } from '../repositories/short-url.repository.interface';
import { IUrlFormatter } from '../services/url-formatter.interface';

@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
    @Inject(URL_FORMATTER)
    private readonly urlFormatter: IUrlFormatter,
  ) {}

  async execute(
    request: CreateShortUrlRequestDto,
  ): Promise<CreateShortUrlResponseDto> {
    const shortCode = this.urlFormatter.generateShortCode();
    const shortUrl = ShortUrl.create(
      request.originalUrl,
      shortCode,
      request?.userId,
    );

    await this.shortUrlRepository.save(shortUrl);

    const fullUrl = this.urlFormatter.generateFullUrl(shortUrl.shortCode);
    return new CreateShortUrlResponseDto(fullUrl);
  }
}
