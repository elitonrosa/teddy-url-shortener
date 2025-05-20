import { ApiProperty } from '@nestjs/swagger';

import { PaginationResponseDto } from '../../../../shared/dtos/pagination.dto';

export class ShortUrlResponseDto {
  @ApiProperty({
    description: 'URL curta gerada',
    example: 'https://teddy.com/abc123',
  })
  shortUrl: string;

  constructor(shortUrl: string) {
    this.shortUrl = shortUrl;
  }
}

export class OriginalUrlResponseDto {
  @ApiProperty({
    description: 'URL original',
    example: 'https://www.exemplo.com/pagina-muito-longa',
  })
  url: string;

  constructor(originalUrl: string) {
    this.url = originalUrl;
  }
}

export class ShortUrlItemResponseDto {
  @ApiProperty({
    description: 'URL curta',
    example: 'https://teddy.com/abc123',
  })
  shortUrl: string;

  @ApiProperty({
    description: 'URL original',
    example: 'https://www.exemplo.com/pagina-muito-longa',
  })
  originalUrl: string;

  @ApiProperty({
    description: 'Número de cliques',
    example: 42,
  })
  clickCount: number;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-03-20T10:00:00Z',
  })
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

export class ListShortUrlsResponseDto extends PaginationResponseDto<ShortUrlItemResponseDto> {
  @ApiProperty({
    description: 'Lista de URLs curtas',
    type: [ShortUrlItemResponseDto],
  })
  declare items: ShortUrlItemResponseDto[];

  constructor(
    items: ShortUrlItemResponseDto[],
    total: number,
    page: number,
    limit: number,
    totalPages: number,
  ) {
    super(items, total, page, limit, totalPages);
  }
}
