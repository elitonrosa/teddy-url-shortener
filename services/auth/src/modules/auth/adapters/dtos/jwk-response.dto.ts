import { ApiProperty } from '@nestjs/swagger';

export class JwkResponseDto {
  @ApiProperty({ description: 'Identificador único da chave' })
  kid: string;

  @ApiProperty({ description: 'Tipo da chave' })
  kty: string;

  @ApiProperty({ description: 'Algoritmo usado' })
  alg: string;

  @ApiProperty({ description: 'Uso da chave' })
  use: string;

  @ApiProperty({ description: 'Chave pública em formato PEM' })
  x5c: string[];

  constructor(data: { id: string; publicKey: string }) {
    this.kid = data.id;
    this.kty = 'RSA';
    this.alg = 'RS256';
    this.use = 'sig';
    this.x5c = [data.publicKey];
  }
}
