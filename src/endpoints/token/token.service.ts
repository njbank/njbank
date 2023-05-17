import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Big from 'big.js';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Any, Repository } from 'typeorm';

import { LoggingService } from '../../modules/logging/logging.service';
import { Log } from '../../modules/logging/tneities/log.entity';
import { KfcService } from '../kfc/kfc.service';
import { RankingBoard } from '../ranking/entities/ranking-board.entity';
import { RankingEntry } from '../ranking/entities/ranking-entriy.entity';
import { ShopService } from '../shop/shop.service';
import { Role } from '../users/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { BuyTokenDto } from './dto/buy-token.dto';
import { CreateTokenDto } from './dto/create-token.dto';
import { TransactionTokenDto } from './dto/transaction-token.dto';
import { TransferTokenDto } from './dto/transfer-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { OperationType } from './entities/operation-type.entity';
import { RankingType } from './entities/ranking-type.entity';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RankingBoard)
    private rankingBoardRepository: Repository<RankingBoard>,
    @InjectRepository(RankingEntry)
    private rankingEntriesRepository: Repository<RankingEntry>,
    private readonly usersService: UsersService,
    private readonly kfcService: KfcService,
    private readonly shopService: ShopService,
    private readonly loggingService: LoggingService,
  ) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault('Asia/Tokyo');
  }

  async create(createTokenDto: CreateTokenDto) {
    const token = await this.getToken(createTokenDto.name);
    await this.usersService.getUser(createTokenDto.owner);
    if (token) {
      throw new ConflictException(`既に${token.name}は存在します。`);
    }
    const user = await this.usersService.getUser(createTokenDto.owner);
    if (user.role === Role.guest) {
      `OwnerにはMember以上の権限が必要です。`;
    }
    await this.tokenRepository
      .save({
        name: createTokenDto.name,
        owner: createTokenDto.owner,
        rate: createTokenDto.rate,
        checkingIp: createTokenDto.checkingIp,
        rankingType: createTokenDto.rankingType,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return `${createTokenDto.name}を作成しました。`;
  }

  async updateToken(
    updateTokenDto: UpdateTokenDto,
    name: string,
    ipAddress: string,
  ) {
    const token = await this.getToken(name);
    if (updateTokenDto.owner) {
      await this.usersService.getUser(updateTokenDto.owner);
    }
    if (!token) {
      throw new ForbiddenException(`${token.name}は存在しません。`);
    }
    if (updateTokenDto.owner) {
      const user = await this.usersService.getUser(updateTokenDto.owner);
      if (user.role === Role.guest) {
        `OwnerにはMember以上の権限が必要です。`;
      }
    }
    this.usersService.checkIp(token.owner, ipAddress, false);
    await this.tokenRepository
      .update(name, {
        owner: updateTokenDto.owner,
        rate: updateTokenDto.rate,
        checkingIp: updateTokenDto.checkingIp,
        rankingType: updateTokenDto.rankingType,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return `${name}を更新しました。`;
  }

  async checkToken(id: string, name: string, ipAddress: string) {
    const user = await this.usersService.getUser(id);
    const token = await this.getToken(name);
    if (!token) {
      throw new ForbiddenException(`${name}は存在しません。`);
    }
    if (token.checkingIp) {
      await this.usersService.checkIp(id, ipAddress);
    }
    if (!user.tokens[name]) {
      return 0;
    }
    return user.tokens[name];
  }

  async depositToken(
    transactionTokenDto: TransactionTokenDto,
    name: string,
    ipAddress: string,
  ) {
    let user = await this.usersService.getUser(transactionTokenDto.id);
    const token = await this.getToken(name);
    if (!token) {
      throw new ForbiddenException(`${name}は存在しません。`);
    }
    if (token.checkingIp) {
      await this.usersService.checkIp(transactionTokenDto.id, ipAddress);
    }
    user = await this.addToken(
      user,
      token,
      transactionTokenDto.amount,
      'deposit',
    );
    if (transactionTokenDto.isRanking) {
      this.rankingUpdate(
        token,
        user,
        transactionTokenDto.amount,
        transactionTokenDto.tags,
      );
    }
    return user.tokens[name];
  }

  async withdrawToken(
    transactionTokenDto: TransactionTokenDto,
    name: string,
    ipAddress: string,
  ) {
    let user = await this.usersService.getUser(transactionTokenDto.id);
    const token = await this.getToken(name);
    if (!token) {
      throw new ForbiddenException(`${name}は存在しません。`);
    }
    if (token.checkingIp) {
      await this.usersService.checkIp(transactionTokenDto.id, ipAddress);
    }
    user = await this.removeToken(
      user,
      token,
      transactionTokenDto.amount,
      'withdraw',
    );
    if (transactionTokenDto.isRanking) {
      this.rankingUpdate(
        token,
        user,
        -transactionTokenDto.amount,
        transactionTokenDto.tags,
      );
    }
    return user.tokens[name];
  }

  async transferToken(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transferTokenDto: TransferTokenDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipAddress: string,
  ) {
    return `Todo`;
  }

  async buyToken(buyTokenDto: BuyTokenDto, name: string, ipAddress: string) {
    let user = await this.usersService.getUser(buyTokenDto.id);
    const token = await this.getToken(name);
    if (!token) {
      throw new ForbiddenException(`${name}は存在しません。`);
    }
    await this.usersService.checkIp(buyTokenDto.id, ipAddress);
    const kfcAmount = new Big(buyTokenDto.amount).times(token.rate);
    user = await this.kfcService.removeKfc(
      user,
      kfcAmount,
      `buy token ${token.name} > ${buyTokenDto.amount}`,
    );
    user = await this.addToken(
      user,
      token,
      buyTokenDto.amount,
      `buy token ${token.name} > ${buyTokenDto.amount}`,
    );
    if (token.operationType === OperationType.user) {
      const operator = await this.usersService.getUser(token.operator);
      await this.kfcService.addKfc(
        operator,
        kfcAmount,
        `token purchased ${token.name} > ${buyTokenDto.amount}`,
      );
    } else if (token.operationType === OperationType.shop) {
      const operator = await this.shopService.getShop(token.operator);
      await this.shopService.addKfc(
        operator,
        kfcAmount,
        `token purchased ${token.name} > ${buyTokenDto.amount}`,
      );
    }
    return user.tokens[name];
  }

  async buyAndWithdrawToken(
    transactionTokenDto: TransactionTokenDto,
    name: string,
    ipAddress: string,
  ) {
    let user = await this.usersService.getUser(transactionTokenDto.id);
    const token = await this.getToken(name);
    if (!token) {
      throw new ForbiddenException(`${name}は存在しません。`);
    }
    if (
      user.tokens[token.name] &&
      user.tokens[token.name] > transactionTokenDto.amount
    ) {
      if (token.checkingIp) {
        await this.usersService.checkIp(transactionTokenDto.id, ipAddress);
      }
      user = await this.removeToken(
        user,
        token,
        transactionTokenDto.amount,
        'withdraw',
      );
    } else {
      await this.usersService.checkIp(transactionTokenDto.id, ipAddress);
      const kfcAmount = new Big(transactionTokenDto.amount).times(token.rate);
      user = await this.kfcService.removeKfc(
        user,
        kfcAmount,
        `buy and withdraw token ${token.name} > ${transactionTokenDto.amount}`,
      );
      if (token.operationType === OperationType.user) {
        const operator = await this.usersService.getUser(token.operator);
        await this.kfcService.addKfc(
          operator,
          kfcAmount,
          `token purchased ${token.name} > ${transactionTokenDto.amount}`,
        );
      } else if (token.operationType === OperationType.shop) {
        const operator = await this.shopService.getShop(token.operator);
        await this.shopService.addKfc(
          operator,
          kfcAmount,
          `token purchased ${token.name} > ${transactionTokenDto.amount}`,
        );
      }
    }
    if (transactionTokenDto.isRanking) {
      this.rankingUpdate(
        token,
        user,
        -transactionTokenDto.amount,
        transactionTokenDto.tags,
      );
    }
    return user.tokens[name];
  }

  private async rankingUpdate(
    token: Token,
    user: User,
    amount: number,
    tags?: string[],
  ) {
    const date = new Date();
    let boards: RankingBoard[];
    if (tags === undefined || tags === null || tags.length === 0) {
      const query = await this.rankingBoardRepository.query(
        `SELECT * FROM ranking_board WHERE date @> '${dayjs(date).format(
          'YYYY-MM-DD hh:mm:ss.SSSZ',
        )}'::timestamptz`,
      );
      boards = [];
      for (const item of query) {
        if (item.token === token.name) {
          boards.push({
            id: item.id,
            tag: item.tag,
            token: item.token,
            date: item.date,
          });
        }
      }
    } else {
      boards = await this.rankingBoardRepository
        .find({
          where: { token: token.name, tag: Any(tags) },
        })
        .catch((e) => {
          throw new InternalServerErrorException(e.message);
        });
    }
    if (boards.length === 0) {
      if (token.rankingType === RankingType.none) {
        throw new ForbiddenException('ランキングボードが見つかりませんでした');
      }
      let newTag: string;
      let newRange: string;
      switch (token.rankingType) {
        case RankingType.monthly:
          {
            const startDate = new Date(date);
            startDate.setDate(1);
            const endDate = new Date(date);
            endDate.setDate(1);
            endDate.setMonth(endDate.getMonth() + 1);
            newTag = dayjs(startDate).tz().format('YYYY-MM');
            newRange = `[${dayjs(startDate)
              .tz()
              .format('YYYY-MM-DD')} 00:00:00.000+09:00,${dayjs(endDate)
              .tz()
              .format('YYYY-MM-DD')} 00:00:00.000+09:00)`;
          }
          break;
        case RankingType.yearly:
          {
            const startDate = new Date(date);
            startDate.setDate(1);
            startDate.setMonth(0);
            const endDate = new Date(date);
            endDate.setDate(1);
            endDate.setMonth(0);
            endDate.setDate(1);
            endDate.setFullYear(endDate.getFullYear() + 1);
            newTag = dayjs(startDate).tz().format('YYYY');
            newRange = `[${dayjs(startDate)
              .tz()
              .format('YYYY-MM-DD')} 00:00:00.000+09:00,${dayjs(endDate)
              .tz()
              .format('YYYY-MM-DD')} 00:00:00.000+09:00)`;
          }
          break;
        case RankingType.persistent:
          {
            newTag = `${token.name}-persistent`;
            newRange = `[${dayjs(date)
              .tz()
              .format('YYYY-MM-DD hh:mm:ss.SSSZ')},)`;
          }
          break;
      }
      await this.rankingBoardRepository
        .save({
          token: token.name,
          tag: newTag,
          date: newRange,
        })
        .catch((e) => {
          throw new InternalServerErrorException(e.message);
        });
      await this.rankingUpdate(token, user, amount, tags);
    } else {
      for (const item of boards) {
        const entry = await this.rankingEntriesRepository
          .findOneBy([{ board: item.id, userId: user.id }])
          .catch((e) => {
            throw new InternalServerErrorException(e.message);
          });
        if (entry) {
          await this.rankingEntriesRepository.update(entry.id, {
            amount: entry.amount + amount,
          });
        } else {
          await this.rankingEntriesRepository
            .save({
              userId: user.id,
              board: item.id,
              amount: amount,
            })
            .catch((e) => {
              throw new InternalServerErrorException(e.message);
            });
        }
      }
    }
  }

  async getToken(name: string) {
    const token = await this.tokenRepository.findOneBy({ name }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    return token;
  }

  async addToken(user: User, token: Token, amount: number, reason = '') {
    if (user.tokens[token.name]) {
      user.tokens[token.name] += amount;
      await this.userRepository
        .update(user.id, {
          tokens: user.tokens,
        })
        .catch((e) => {
          throw new InternalServerErrorException(e.message);
        });
    } else {
      user.tokens[token.name] = amount;
      await this.userRepository
        .update(user.id, {
          tokens: user.tokens,
        })
        .catch((e) => {
          throw new InternalServerErrorException(e.message);
        });
    }
    await this.loggingService.log(
      new Log(
        'user',
        user.id,
        `token:${token.name}`,
        `${amount.toString()}`,
        reason,
      ),
    );
    return user;
  }

  async removeToken(user: User, token: Token, amount: number, reason = '') {
    if (user.tokens[token.name]) {
      if (user.tokens[token.name] < amount) {
        throw new ForbiddenException(`トークンが足りません。`);
      }
      user.tokens[token.name] -= amount;
      await this.userRepository
        .update(user.id, {
          tokens: user.tokens[token.name],
        })
        .catch((e) => {
          throw new InternalServerErrorException(e.message);
        });
    } else {
      throw new ForbiddenException(`トークンを持っていません。`);
    }
    await this.loggingService.log(
      new Log(
        'user',
        user.id,
        `token:${token.name}`,
        `${amount.toString()}`,
        reason,
      ),
    );
    return user;
  }
}
