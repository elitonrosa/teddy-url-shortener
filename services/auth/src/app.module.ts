import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { GlobalConfigModule } from './infrastructure/config/config.module';
import { GlobalTypeOrmModule } from './infrastructure/database/typeorm.module';

@Module({
  imports: [AuthModule, GlobalConfigModule, GlobalTypeOrmModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
