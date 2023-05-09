import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KfcModule } from '../kfc/kfc.module';
import { RankingBoard } from '../ranking/entities/ranking-board.entity';
import { RankingEntries } from '../ranking/entities/ranking-entries.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

import { Token } from './entities/token.entity';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, User, RankingBoard, RankingEntries]),
    UsersModule,
    KfcModule,
  ],
  exports: [TokenService],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
