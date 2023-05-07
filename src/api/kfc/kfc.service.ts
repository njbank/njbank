import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NeosService } from '../../modules/neos/neos.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { DepositKfcDto } from './dto/deposit-kfc.dto';
import { TransferKfcDto } from './dto/transfer-kfc.dto';
import { WithdrawKfcDto } from './dto/withdraw-kfc.dto';

@Injectable()
export class KfcService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly neosService: NeosService,
    private readonly usersService: UsersService,
  ) {}

  async checkKfc(id: string, ipAddress: string) {
    await this.usersService.checkIp(id, ipAddress);
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!user) {
      throw new ForbiddenException(`${id}は見つかりませんでした。`);
    }
    return user.amount;
  }

  async depositKfc(depositKfcDto: DepositKfcDto, ipAddress: string) {
    const id = depositKfcDto.id;
    await this.usersService.checkIp(id, ipAddress);
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!user) {
      throw new ForbiddenException(`${id}は見つかりませんでした。`);
    }
    await this.userRepository
      .update(id, { amount: user.amount + depositKfcDto.amount })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    await this.neosService.sendMessage(
      id,
      `入金 ${depositKfcDto.amount}KFC 残高 ${
        user.amount + depositKfcDto.amount
      } KFC\nご利用ありがとうございます。`,
    );
    return user.amount + depositKfcDto.amount;
  }

  async withdrawKfc(withdrawKfcDto: WithdrawKfcDto, ipAddress: string) {
    const id = withdrawKfcDto.id;
    await this.usersService.checkIp(id, ipAddress);
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!user) {
      throw new ForbiddenException(`${id}は見つかりませんでした。`);
    }
    if (user.amount < withdrawKfcDto.amount) {
      throw new ForbiddenException(`お金が足りません。`);
    }
    await this.neosService.sendKfc(
      id,
      withdrawKfcDto.amount,
      `出金 残高 ${
        user.amount - withdrawKfcDto.amount
      } KFC\nご利用ありがとうございます。`,
    );
    await this.userRepository
      .update(id, { amount: user.amount - withdrawKfcDto.amount })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return user.amount - withdrawKfcDto.amount;
  }

  async transferKfc(transferKfcDto: TransferKfcDto, ipAddress: string) {
    const id = transferKfcDto.id;
    let toId = transferKfcDto.to;
    await this.usersService.checkIp(id, ipAddress);
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!user) {
      throw new ForbiddenException(`${id}は見つかりませんでした。`);
    }
    let toUser = await this.userRepository
      .findOneBy({ id: toId })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    if (!toUser) {
      toUser = await this.userRepository
        .findOneBy({ userName: toId })
        .catch((e) => {
          throw new InternalServerErrorException(e.message);
        });
      if (!toUser) {
        throw new ForbiddenException(`${toId}は見つかりませんでした。`);
      } else {
        toId = toUser.id;
      }
    }
    if (user.amount < transferKfcDto.amount) {
      throw new ForbiddenException(`お金が足りません。`);
    }
    if (transferKfcDto.dest === 'account') {
      await this.neosService.sendKfc(
        toId,
        transferKfcDto.amount,
        `${user.userName} 様より送金がありました。`,
      );
    } else {
      await this.userRepository
        .update(toId, { amount: user.amount + transferKfcDto.amount })
        .catch((e) => {
          throw new InternalServerErrorException(e.message);
        });
      await this.neosService.sendMessage(
        toId,
        `いつもご利用ありがとうございます。\n${user.userName} 様より口座へ ${
          transferKfcDto.amount
        } KFC振り込まれました。\n残高 ${
          user.amount + transferKfcDto.amount
        } KFC`,
      );
    }
    await this.userRepository
      .update(id, { amount: user.amount - transferKfcDto.amount })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    await this.neosService.sendMessage(
      id,
      `いつもご利用ありがとうございます。\n${user.userName} 様へ ${
        transferKfcDto.amount
      } KFC振り込みました。\n残高 ${user.amount - transferKfcDto.amount} KFC`,
    );
    return user.amount - transferKfcDto.amount;
  }

  async addKfc(user: User, amount: number) {
    await this.userRepository
      .update(user.id, { amount: user.amount + amount })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return user.amount + amount;
  }

  async removeKfc(user: User, amount: number) {
    if (user.amount < amount) {
      throw new ForbiddenException('KFCが足りません');
    }
    await this.userRepository
      .update(user.id, { amount: user.amount - amount })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return user.amount - amount;
  }
}