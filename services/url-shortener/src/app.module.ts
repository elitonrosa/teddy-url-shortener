import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { ShortUrlModule } from './modules/short-url/short-url.module';
import { GlobalTypeOrmModule } from './infrastructure/database/typeorm.module';
import { GlobalConfigModule } from 'src/infrastructure/config/config.module';
import { GlobalBullModule } from './infrastructure/queue/bull.module';
import { UserContextMiddleware } from './shared/middlewares/user-context.middleware';

@Module({
  imports: [
    GlobalConfigModule,
    GlobalTypeOrmModule,
    GlobalBullModule,
    ShortUrlModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserContextMiddleware).forRoutes('*');
  }
}
