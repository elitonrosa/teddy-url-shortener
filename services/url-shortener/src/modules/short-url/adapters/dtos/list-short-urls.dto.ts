import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class ListShortUrlsRequestDto {
  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number;

  @ApiProperty({
    description: 'Limite de itens por página',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number;
}
