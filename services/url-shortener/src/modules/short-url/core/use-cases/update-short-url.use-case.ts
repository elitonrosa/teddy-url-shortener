import { Inject, Injectable } from '@nestjs/common';

import { SHORT_URL_REPOSITORY } from '../constants/injection-tokens';
import { UpdateShortUrlRequestDto } from '../dtos/update-short-url.dto';
import {
  ShortUrlNotFoundException,
  UnauthorizedUpdateException,
} from '../exceptions/short-url.exception';
import { IShortUrlRepository } from '../repositories/short-url.repository.interface';

@Injectable()
export class UpdateShortUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(request: UpdateShortUrlRequestDto): Promise<void> {
    const shortUrl = await this.shortUrlRepository.findByShortCode(
      request.shortCode,
    );
    if (!shortUrl) {
      throw new ShortUrlNotFoundException();
    }

    if (!shortUrl.belongsToUser(request.userId)) {
      throw new UnauthorizedUpdateException();
    }

    shortUrl.updateOriginalUrl(request.originalUrl);
    await this.shortUrlRepository.save(shortUrl);
  }
}
