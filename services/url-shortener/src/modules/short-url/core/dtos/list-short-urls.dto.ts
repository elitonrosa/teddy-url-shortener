import { PaginationRequestDto } from '../../../../shared/dtos/pagination.dto';

export class ShortUrlItemDto {
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    shortUrl: string,
    originalUrl: string,
    clickCount: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.shortUrl = shortUrl;
    this.originalUrl = originalUrl;
    this.clickCount = clickCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class ListShortUrlsRequestDto extends PaginationRequestDto {
  userId: string;

  constructor(userId: string, page: number, limit: number) {
    super(page, limit);
    this.userId = userId;
  }
}

export class ListShortUrlsResponseDto {
  items: ShortUrlItemDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  constructor(
    items: ShortUrlItemDto[],
    page: number,
    limit: number,
    total: number,
    totalPages: number,
  ) {
    this.items = items;
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = totalPages;
  }
}
