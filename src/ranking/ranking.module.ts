import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RankingBoard } from './entities/ranking-board.entity';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';

@Module({
  imports: [TypeOrmModule.forFeature([RankingBoard])],
  exports: [TypeOrmModule],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
