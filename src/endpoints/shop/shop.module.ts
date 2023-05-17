import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggingModule } from '../../modules/logging/logging.modules';
import { NeosModule } from '../../modules/neos/neos.modules';
import { KfcModule } from '../kfc/kfc.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

import { Shop } from './entities/shop.entity';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop, User]),
    NeosModule,
    UsersModule,
    KfcModule,
    LoggingModule,
  ],
  exports: [ShopService],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
