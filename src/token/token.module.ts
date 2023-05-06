import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RankingBoard } from '../ranking/entities/ranking-board.entity';
import { RankingEntries } from '../ranking/entities/ranking-entries.entity';
import { User } from '../users/entities/user.entity';
import { Token } from './entities/token.entity';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([RankingBoard]),
    TypeOrmModule.forFeature([RankingEntries]),
  ],
  exports: [TypeOrmModule],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
