import { Module } from '@nestjs/common';

import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { GlobalConfigModule } from './infrastructure/config/config.module';
import { GlobalTypeOrmModule } from './infrastructure/database/typeorm.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, GlobalConfigModule, GlobalTypeOrmModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
