import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Big from 'big.js';
import { Repository } from 'typeorm';

import { LoggingService } from '../../modules/logging/logging.service';
import { Log } from '../../modules/logging/tneities/log.entity';
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
    private readonly loggingService: LoggingService,
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
    if (
      !(await this.neosService.KfcCheck(
        user.id,
        transactionKfcDto.amount.toNumber(),
      ))
    ) {
      throw new ForbiddenException('入金に失敗しました。');
    }
    user = await this.addKfc(user, transactionKfcDto.amount, 'deposit');
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
      transactionKfcDto.amount.toNumber(),
      `ご利用ありがとうございます。\n出金 残高 ${user.amount.minus(
        transactionKfcDto.amount,
      )} KFC`,
    );
    user = await this.removeKfc(user, transactionKfcDto.amount, 'withdraw');
    return `${user.amount}`;
  }

  async transferKfc(
    transferKfcDto: TransferKfcDto,
    ipAddress: string,
  ): Promise<string> {
    let fromUser = await this.usersService.getUser(transferKfcDto.id);
    await this.usersService.checkIp(fromUser.id, ipAddress);
    if (fromUser.amount < transferKfcDto.amount) {
      throw new ForbiddenException(`お金が足りません。`);
    }
    if (transferKfcDto.dest === 'account') {
      await this.neosService.sendKfc(
        transferKfcDto.to,
        transferKfcDto.amount.toNumber(),
        `${fromUser.userName} 様より送金がありました。`,
      );
    } else {
      let toUser = await this.usersService.getUser(
        transferKfcDto.to,
        !transferKfcDto.to.startsWith('U-'),
      );
      toUser = await this.addKfc(
        toUser,
        transferKfcDto.amount,
        `transfer from ${fromUser.id}`,
      );
      await this.neosService.sendMessage(
        toUser.id,
        `ご利用ありがとうございます。\n${fromUser.userName} 様より口座へ ${transferKfcDto.amount} KFC振り込まれました。\n残高 ${toUser.amount} KFC`,
      );
    }
    fromUser = await this.removeKfc(
      fromUser,
      transferKfcDto.amount,
      `transfer to ${fromUser.id}`,
    );
    const toUser = await this.usersService.getUser(
      transferKfcDto.to,
      !transferKfcDto.to.startsWith('U-'),
    );
    await this.neosService.sendMessage(
      fromUser.id,
      `ご利用ありがとうございます。\n${toUser.userName} 様へ ${transferKfcDto.amount} KFC振り込みました。\n残高 ${fromUser.amount} KFC`,
    );
    return `送金が完了しました。`;
  }

  async addKfc(user: User, amount: Big, reason = '') {
    await this.userRepository
      .update(user.id, { amount: user.amount.plus(amount).toString() })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    await this.loggingService.log(
      new Log('user', user.id, 'kfc', amount.toString(), reason),
    );
    user.amount = user.amount.plus(amount);
    return user;
  }

  async removeKfc(user: User, amount: Big, reason = '') {
    if (user.amount < amount) {
      throw new ForbiddenException('KFCが足りません');
    }
    await this.userRepository
      .update(user.id, { amount: user.amount.minus(amount).toString() })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    await this.loggingService.log(
      new Log('user', user.id, 'kfc', `-${amount.toString()}`, reason),
    );
    user.amount = user.amount.minus(amount);
    return user;
  }
}
