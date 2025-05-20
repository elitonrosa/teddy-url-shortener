import { ShortUrl } from '../../core/entities/short-url.entity';
import { ShortUrlEntity } from '../entities/short-url.entity';

export class ShortUrlMapper {
  static toDomain(entity: ShortUrlEntity): ShortUrl {
    return new ShortUrl(
      entity.id,
      entity.originalUrl,
      entity.shortCode,
      entity.userId ?? undefined,
      entity.clickCount,
      entity.updatedAt,
      entity.createdAt,
    );
  }

  static toPersistence(domain: ShortUrl): ShortUrlEntity {
    const entity = new ShortUrlEntity();
    entity.id = domain.id;
    entity.originalUrl = domain.originalUrl;
    entity.shortCode = domain.shortCode;
    entity.userId = domain.userId ?? null;
    entity.clickCount = domain.clickCount;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
