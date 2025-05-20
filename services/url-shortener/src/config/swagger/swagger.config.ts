import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('URL Shortener API')
  .setDescription('API para encurtamento de URLs')
  .setVersion('1.0')
  .build();
