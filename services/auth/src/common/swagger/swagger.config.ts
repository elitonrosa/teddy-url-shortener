import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Auth Service API')
  .setDescription('API de autenticação e gerenciamento de usuários')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
