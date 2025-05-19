import { Controller, Get, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwksService } from '../../infrastructure/services/jwks.service';
import { AuthExceptionFilter } from '../filters/auth-exception.filter';

@ApiTags('jwks')
@Controller('.well-known')
@UseFilters(AuthExceptionFilter)
export class JwksController {
  constructor(private readonly jwksService: JwksService) {}

  @Get('jwks.json')
  @ApiOperation({ summary: 'Obter chaves JWK' })
  @ApiResponse({
    status: 200,
    description: 'Retorna as chaves JWK no formato JWKS',
    schema: {
      type: 'object',
      properties: {
        keys: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              kid: { type: 'string' },
              kty: { type: 'string' },
              alg: { type: 'string' },
              use: { type: 'string' },
              n: { type: 'string' },
              e: { type: 'string' },
            },
          },
        },
      },
    },
  })
  async getJwks() {
    return this.jwksService.getJwks();
  }
}
