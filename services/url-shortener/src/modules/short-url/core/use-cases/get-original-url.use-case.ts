import { Inject, Injectable } from '@nestjs/common';

import { SHORT_URL_REPOSITORY } from '../constants/injection-tokens';
import {
  GetOriginalUrlRequestDto,
  GetOriginalUrlResponseDto,
} from '../dtos/get-original-url.dto';
import { ShortUrlNotFoundException } from '../exceptions/short-url.exception';
import { IShortUrlRepository } from '../repositories/short-url.repository.interface';

@Injectable()
export class GetOriginalUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(
    request: GetOriginalUrlRequestDto,
  ): Promise<GetOriginalUrlResponseDto> {
    const shortUrl = await this.shortUrlRepository.findByShortCode(
      request.shortCode,
    );
    if (!shortUrl) {
      throw new ShortUrlNotFoundException();
    }

    return new GetOriginalUrlResponseDto(shortUrl.originalUrl);
  }
}
