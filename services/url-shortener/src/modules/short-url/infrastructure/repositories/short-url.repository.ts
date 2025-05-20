import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { ShortUrl } from '../../core/entities/short-url.entity';
import { ShortCodeCollisionException } from '../../core/exceptions/short-url.exception';
import {
  IShortUrlRepository,
  PaginationResult,
} from '../../core/repositories/short-url.repository.interface';
import { ShortUrlEntity } from '../entities/short-url.entity';
import { ShortUrlMapper } from '../mappers/short-url.mapper';

@Injectable()
export class TypeOrmShortUrlRepository implements IShortUrlRepository {
  constructor(
    @InjectRepository(ShortUrlEntity)
    private readonly repository: Repository<ShortUrlEntity>,
  ) {}

  async save(shortUrl: ShortUrl): Promise<ShortUrl> {
    try {
      const typeOrmEntity = ShortUrlMapper.toPersistence(shortUrl);
      const savedEntity = await this.repository.save(typeOrmEntity);
      return ShortUrlMapper.toDomain(savedEntity);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        throw new ShortCodeCollisionException(shortUrl.shortCode);
      }
      throw error;
    }
  }

  async findByShortCode(shortCode: string): Promise<ShortUrl | null> {
    const typeOrmEntity = await this.repository.findOne({
      where: { shortCode },
    });
    if (!typeOrmEntity) {
      return null;
    }
    return ShortUrlMapper.toDomain(typeOrmEntity);
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginationResult<ShortUrl>> {
    const [items, total] = await this.repository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map(ShortUrlMapper.toDomain),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async update(shortUrl: ShortUrl): Promise<ShortUrl> {
    const typeOrmEntity = ShortUrlMapper.toPersistence(shortUrl);
    const updatedEntity = await this.repository.save(typeOrmEntity);
    return ShortUrlMapper.toDomain(updatedEntity);
  }

  async delete(shortCodeId: string): Promise<void> {
    await this.repository.softDelete({
      id: shortCodeId,
    });
  }

  async incrementClickCount(
    shortCode: string,
    count: number = 1,
  ): Promise<void> {
    await this.repository.increment({ shortCode }, 'clickCount', count);
  }
}
