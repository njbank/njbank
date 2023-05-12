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

import { TransactionKfcDto } from './dto/transaction-kfc.dto';
import { TransferKfcDto } from './dto/transfer-kfc.dto';

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
    transactionKfcDto: TransactionKfcDto,
    ipAddress: string,
  ): Promise<string> {
    await this.usersService.checkIp(transactionKfcDto.id, ipAddress);
    let user = await this.usersService.getUser(transactionKfcDto.id);
    user = await this.addKfc(user, transactionKfcDto.amount);
    await this.neosService.sendMessage(
      transactionKfcDto.id,
      `ご利用ありがとうございます。\n入金 ${transactionKfcDto.amount}KFC 残高 ${user.amount} KFC`,
    );
    return `${user.amount}`;
  }

  async withdrawKfc(
    transactionKfcDto: TransactionKfcDto,
    ipAddress: string,
  ): Promise<string> {
    const id = transactionKfcDto.id;
    await this.usersService.checkIp(id, ipAddress);
    let user = await this.usersService.getUser(transactionKfcDto.id);
    if (user.amount < transactionKfcDto.amount) {
      throw new ForbiddenException(`お金が足りません。`);
    }
    await this.neosService.sendKfc(
      id,
      transactionKfcDto.amount,
      `ご利用ありがとうございます。\n出金 残高 ${
        user.amount - transactionKfcDto.amount
      } KFC`,
    );
    user = await this.removeKfc(user, transactionKfcDto.amount);
    return `${user.amount}`;
  }

  async transferKfc(
    transferKfcDto: TransferKfcDto,
    ipAddress: string,
  ): Promise<string> {
    let fromUser = await this.usersService.getUser(transferKfcDto.id);
    let toUser = await this.usersService.getUser(
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
      toUser = await this.addKfc(toUser, transferKfcDto.amount);
      await this.neosService.sendMessage(
        toUser.id,
        `ご利用ありがとうございます。\n${fromUser.userName} 様より口座へ ${transferKfcDto.amount} KFC振り込まれました。\n残高 ${toUser.amount} KFC`,
      );
    }
    fromUser = await this.removeKfc(fromUser, transferKfcDto.amount);
    await this.neosService.sendMessage(
      fromUser.id,
      `ご利用ありがとうございます。\n${toUser.userName} 様へ ${transferKfcDto.amount} KFC振り込みました。\n残高 ${fromUser.amount} KFC`,
    );
    return `送金が完了しました。`;
  }

  async addKfc(user: User, amount: number) {
    await this.userRepository
      .update(user.id, { amount: user.amount + amount })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    user.amount += amount;
    return user;
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
    user.amount -= amount;
    return user;
  }
}