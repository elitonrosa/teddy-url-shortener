import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { ShortUrlModule } from './modules/short-url/short-url.module';
import { GlobalTypeOrmModule } from './infrastructure/database/typeorm.module';
import { GlobalConfigModule } from 'src/infrastructure/config/config.module';
import { GlobalBullModule } from './infrastructure/queue/bull.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { JwtAuthMiddleware } from './shared/middlewares/jwt-auth.middleware';

@Module({
  imports: [
    GlobalConfigModule,
    GlobalTypeOrmModule,
    GlobalBullModule,
    ShortUrlModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAuthMiddleware).forRoutes('*');
  }
}
