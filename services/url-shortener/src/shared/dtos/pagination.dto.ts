import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Total de itens',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Limite de itens por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 10,
  })
  totalPages: number;

  constructor(total: number, page: number, limit: number, totalPages: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = totalPages;
  }
}

export class PaginationRequestDto {
  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Limite de itens por página',
    example: 10,
  })
  limit: number;

  constructor(page: number, limit: number) {
    this.page = page;
    this.limit = limit;
  }
}

export class PaginationResponseDto<T> {
  @ApiProperty({
    description: 'Lista de itens',
    type: [Object],
  })
  items: T[];

  @ApiProperty({
    description: 'Metadados da paginação',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  constructor(
    items: T[],
    total: number,
    page: number,
    limit: number,
    totalPages: number,
  ) {
    this.items = items;
    this.meta = new PaginationMetaDto(total, page, limit, totalPages);
  }
}
