import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RankingBoard } from './entities/ranking-board.entity';
import { RankingEntry } from './entities/ranking-entriy.entity';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(RankingBoard)
    private rankingBoardRepository: Repository<RankingBoard>,
    @InjectRepository(RankingEntry)
    private rankingEntriesRepository: Repository<RankingEntry>,
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
        where: { board: board.id },
        order: { amount: 'desc', userId: 'asc' },
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    let ans = '';
    for (let i = 0; i < entry.length; i++) {
      const item = entry[i];
      ans += `${i !== 0 ? ',' : ''}${encodeURI(item.user.userName)}:${
        item.amount
      }`;
    }
    return ans;
  }
}
