import { ShortUrl } from '../entities/short-url.entity';

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IShortUrlRepository {
  save(shortUrl: ShortUrl): Promise<ShortUrl>;
  findByShortCode(shortCode: string): Promise<ShortUrl | null>;
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginationResult<ShortUrl>>;
  update(shortUrl: ShortUrl): Promise<ShortUrl>;
  delete(shortCodeId: string): Promise<void>;
  incrementClickCount(shortCode: string, count?: number): Promise<void>;
}
