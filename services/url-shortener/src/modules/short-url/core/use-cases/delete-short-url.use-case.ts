import { Inject, Injectable } from '@nestjs/common';

import { SHORT_URL_REPOSITORY } from '../constants/injection-tokens';
import { DeleteShortUrlRequestDto } from '../dtos/delete-short-url.dto';
import {
  ShortUrlNotFoundException,
  UnauthorizedDeleteException,
} from '../exceptions/short-url.exception';
import { IShortUrlRepository } from '../repositories/short-url.repository.interface';

@Injectable()
export class DeleteShortUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(request: DeleteShortUrlRequestDto): Promise<void> {
    const shortUrl = await this.shortUrlRepository.findByShortCode(
      request.shortCode,
    );
    if (!shortUrl) {
      throw new ShortUrlNotFoundException();
    }

    if (!shortUrl.belongsToUser(request.userId)) {
      throw new UnauthorizedDeleteException();
    }

    await this.shortUrlRepository.delete(shortUrl.id);
  }
}
