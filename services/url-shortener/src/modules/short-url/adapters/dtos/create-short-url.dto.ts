import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, Matches, MaxLength } from 'class-validator';

export class CreateShortUrlRequestDto {
  @ApiProperty({
    description: 'URL original',
    example: 'https://www.github.com',
  })
  @IsString()
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_tld: true,
      require_valid_protocol: true,
    },
    {
      message: 'Invalid URL format',
    },
  )
  @MaxLength(2048, {
    message: 'URL too long',
  })
  @Matches(
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
    { message: 'Invalid URL format' },
  )
  originalUrl: string;
}
