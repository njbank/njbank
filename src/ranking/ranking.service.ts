import { Repository } from 'typeorm';

import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RankingBoard } from './entities/ranking-board.entity';
import { RankingEntries } from './entities/ranking-entries.entity';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(RankingBoard)
    private rankingBoardRepository: Repository<RankingBoard>,
    @InjectRepository(RankingEntries)
    private rankingEntriesRepository: Repository<RankingEntries>,
  ) {}

  async getEntries(token: string, tag: string) {
    const board = await this.rankingBoardRepository
      .findOneBy({ token, tag })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    if (!board) {
      throw new ForbiddenException('ランキングが存在しません。');
    }
    const entry = await this.rankingEntriesRepository
      .find({
        select: ['userName', 'board', 'amount'],
        where: [{ board: board.id }],
        order: { amount: 'desc', userName: 'asc' },
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    let ans = '';
    for (let i = 0; i < entry.length; i++) {
      const item = entry[i];
      if (i !== 0) {
        ans += ',';
      }
      ans += `${i !== 0 ? ',' : ''}${encodeURI(item.userName)}:${item.amount}`;
    }
    return ans;
  }
}
