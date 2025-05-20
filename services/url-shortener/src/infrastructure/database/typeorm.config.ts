import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import dataSource from './data-source';

export const getTypeOrmConfig = (): TypeOrmModuleOptions => ({
  ...dataSource.options,
  autoLoadEntities: true,
});
