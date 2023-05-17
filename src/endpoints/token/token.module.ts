import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggingModule } from '../../modules/logging/logging.modules';
import { KfcModule } from '../kfc/kfc.module';
import { RankingBoard } from '../ranking/entities/ranking-board.entity';
import { RankingEntry } from '../ranking/entities/ranking-entriy.entity';
import { ShopModule } from '../shop/shop.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

import { Token } from './entities/token.entity';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, User, RankingBoard, RankingEntry]),
    UsersModule,
    KfcModule,
    ShopModule,
    LoggingModule,
  ],
  exports: [TokenService],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
