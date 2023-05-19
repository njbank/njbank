import { Module } from '@nestjs/common';

import { FactoryService } from './batch.service';
import { DatabaseModule } from './database/database.module';
import { ShopModule } from './endpoints/shop/shop.module';

@Module({
  imports: [DatabaseModule, ShopModule],
  providers: [FactoryService],
})
export class FactoryModule {}
