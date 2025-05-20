import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Redirect,
  UseFilters,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateShortUrlRequestDto as CoreCreateShortUrlRequestDto } from '../../core/dtos/create-short-url.dto';
import { DeleteShortUrlRequestDto } from '../../core/dtos/delete-short-url.dto';
import { IncrementUrlClickCountRequestDto } from '../../core/dtos/increment-url-click-count.dto';
import { ListShortUrlsRequestDto as CoreListShortUrlsRequestDto } from '../../core/dtos/list-short-urls.dto';
import { UpdateShortUrlRequestDto as CoreUpdateShortUrlRequestDto } from '../../core/dtos/update-short-url.dto';
import { CreateShortUrlUseCase } from '../../core/use-cases/create-short-url.use-case';
import { DeleteShortUrlUseCase } from '../../core/use-cases/delete-short-url.use-case';
import { GetOriginalUrlUseCase } from '../../core/use-cases/get-original-url.use-case';
import { IncrementUrlClickCountUseCase } from '../../core/use-cases/increment-url-click-count.use-case';
import { ListShortUrlsUseCase } from '../../core/use-cases/list-short-urls.use-case';
import { UpdateShortUrlUseCase } from '../../core/use-cases/update-short-url.use-case';
import { CreateShortUrlRequestDto } from '../dtos/create-short-url.dto';
import { ListShortUrlsRequestDto } from '../dtos/list-short-urls.dto';
import {
  ListShortUrlsResponseDto,
  OriginalUrlResponseDto,
  ShortUrlResponseDto,
} from '../dtos/short-url-response.dto';
import { UpdateShortUrlRequestDto } from '../dtos/update-short-url.dto';
import { ShortUrlExceptionFilter } from '../filters/short-url-exception.filter';
import { UserId } from '../../../../shared/decorators/user-id.decorator';
import { RequireAuth } from '../../../../shared/decorators/require-auth.decorator';

@ApiTags('short-urls')
@Controller()
@UseFilters(ShortUrlExceptionFilter)
export class ShortUrlController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly getOriginalUrlUseCase: GetOriginalUrlUseCase,
    private readonly listShortUrlsUseCase: ListShortUrlsUseCase,
    private readonly updateShortUrlUseCase: UpdateShortUrlUseCase,
    private readonly deleteShortUrlUseCase: DeleteShortUrlUseCase,
    private readonly incrementUrlClickCountUseCase: IncrementUrlClickCountUseCase,
  ) {}

  @Post('shorten')
  @HttpCode(201)
  @ApiOperation({ summary: 'Cria uma nova URL curta' })
  @ApiResponse({ status: 201, type: ShortUrlResponseDto })
  async create(
    @Body() dto: CreateShortUrlRequestDto,
    @UserId() userId?: string,
  ): Promise<ShortUrlResponseDto> {
    const request = new CoreCreateShortUrlRequestDto(dto.originalUrl, userId);
    const response = await this.createShortUrlUseCase.execute(request);
    return new ShortUrlResponseDto(response.shortUrl);
  }

  @Get('short-urls')
  @RequireAuth()
  @ApiOperation({ summary: 'Lista as URLs curtas' })
  @ApiResponse({ status: 200, type: ListShortUrlsResponseDto })
  async list(
    @Query() dto: ListShortUrlsRequestDto,
    @UserId() userId: string,
  ): Promise<ListShortUrlsResponseDto> {
    const request = new CoreListShortUrlsRequestDto(
      userId,
      dto.page ?? 1,
      dto.limit ?? 50,
    );

    const response = await this.listShortUrlsUseCase.execute(request);
    return new ListShortUrlsResponseDto(
      response.items,
      response.total,
      response.page,
      response.limit,
      response.totalPages,
    );
  }

  @Put('short-urls/:shortCode')
  @RequireAuth()
  @ApiOperation({ summary: 'Atualiza a URL curta' })
  @ApiResponse({ status: 200 })
  async update(
    @Param('shortCode') shortCode: string,
    @Body() dto: UpdateShortUrlRequestDto,
    @UserId() userId: string,
  ): Promise<void> {
    const request = new CoreUpdateShortUrlRequestDto(
      shortCode,
      dto.originalUrl,
      userId,
    );
    await this.updateShortUrlUseCase.execute(request);
  }

  @Delete('short-urls/:shortCode')
  @RequireAuth()
  @ApiOperation({ summary: 'Deleta a URL curta' })
  @ApiResponse({ status: 200 })
  async delete(
    @Param('shortCode') shortCode: string,
    @UserId() userId: string,
  ): Promise<void> {
    const request = new DeleteShortUrlRequestDto(shortCode, userId);
    await this.deleteShortUrlUseCase.execute(request);
  }

  @Get(':shortCode')
  @Redirect()
  @ApiOperation({ summary: 'Redireciona para a URL original' })
  @ApiResponse({ status: 302, type: OriginalUrlResponseDto })
  async getOriginalUrl(
    @Param('shortCode') shortCode: string,
  ): Promise<OriginalUrlResponseDto> {
    const response = await this.getOriginalUrlUseCase.execute(
      new IncrementUrlClickCountRequestDto(shortCode),
    );

    void this.incrementUrlClickCountUseCase.execute(
      new IncrementUrlClickCountRequestDto(shortCode),
    );

    return new OriginalUrlResponseDto(response.originalUrl);
  }
}
