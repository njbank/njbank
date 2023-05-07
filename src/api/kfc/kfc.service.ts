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

  async checkKfc(id: string, ipAddress: string): Promise<string> {
    await this.usersService.checkIp(id, ipAddress);
    const user = await this.usersService.getUser(id);
    return `${user.amount}`;
  }

  async depositKfc(
    depositKfcDto: DepositKfcDto,
    ipAddress: string,
  ): Promise<string> {
    await this.usersService.checkIp(depositKfcDto.id, ipAddress);
    const user = await this.usersService.getUser(depositKfcDto.id);
    const userBalance = await this.addKfc(user, depositKfcDto.amount);
    await this.neosService.sendMessage(
      depositKfcDto.id,
      `ご利用ありがとうございます。\n入金 ${depositKfcDto.amount}KFC 残高 ${userBalance} KFC`,
    );
    return `${userBalance}`;
  }

  async withdrawKfc(
    withdrawKfcDto: WithdrawKfcDto,
    ipAddress: string,
  ): Promise<string> {
    const id = withdrawKfcDto.id;
    await this.usersService.checkIp(id, ipAddress);
    const user = await this.usersService.getUser(withdrawKfcDto.id);
    if (user.amount < withdrawKfcDto.amount) {
      throw new ForbiddenException(`お金が足りません。`);
    }
    await this.neosService.sendKfc(
      id,
      withdrawKfcDto.amount,
      `ご利用ありがとうございます。\n出金 残高 ${
        user.amount - withdrawKfcDto.amount
      } KFC`,
    );
    const userBalance = await this.removeKfc(user, withdrawKfcDto.amount);
    return `${userBalance}`;
  }

  async transferKfc(
    transferKfcDto: TransferKfcDto,
    ipAddress: string,
  ): Promise<string> {
    const fromUser = await this.usersService.getUser(transferKfcDto.id);
    const toUser = await this.usersService.getUser(
      transferKfcDto.to,
      transferKfcDto.to.startsWith('U-'),
    );
    await this.usersService.checkIp(fromUser.id, ipAddress);
    if (fromUser.amount < transferKfcDto.amount) {
      throw new ForbiddenException(`お金が足りません。`);
    }
    if (transferKfcDto.dest === 'account') {
      await this.neosService.sendKfc(
        toUser.id,
        transferKfcDto.amount,
        `${fromUser.userName} 様より送金がありました。`,
      );
    } else {
      const toUserBalance = await this.addKfc(toUser, transferKfcDto.amount);
      await this.neosService.sendMessage(
        toUser.id,
        `ご利用ありがとうございます。\n${fromUser.userName} 様より口座へ ${transferKfcDto.amount} KFC振り込まれました。\n残高 ${toUserBalance} KFC`,
      );
    }
    const fromUserBlance = await this.removeKfc(
      fromUser,
      transferKfcDto.amount,
    );
    await this.neosService.sendMessage(
      fromUser.id,
      `ご利用ありがとうございます。\n${toUser.userName} 様へ ${transferKfcDto.amount} KFC振り込みました。\n残高 ${fromUserBlance} KFC`,
    );
    return `${fromUserBlance}`;
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
