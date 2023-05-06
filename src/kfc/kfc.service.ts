import { Repository } from 'typeorm';

import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { NeosService } from '../neos/neos.service';
import { User } from '../users/entities/user.entity';
import { DepositKfcDto } from './dto/deposit-kfc.dto';
import { TransferKfcDto } from './dto/transfer-kfc.dto';
import { WithdrawKfcDto } from './dto/withdraw-kfc.dto';

@Injectable()
export class KfcService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly neosService: NeosService,
  ) {}

  async checkKfc(id: string, ipAddress: string) {
    await this.checkIp(id, ipAddress);
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
    await this.checkIp(id, ipAddress);
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
      `出金 ${depositKfcDto.amount}\nご利用ありがとうございました。`,
    );
    return user.amount + depositKfcDto.amount;
  }

  async withdrawKfc(withdrawKfcDto: WithdrawKfcDto, ipAddress: string) {
    const id = withdrawKfcDto.id;
    await this.checkIp(id, ipAddress);
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
      `出金 -\nご利用ありがとうございました。`,
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
    await this.checkIp(id, ipAddress);
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
        `${user.userName} 様より口座へ ${transferKfcDto.amount} KFC振り込まれました。`,
      );
    }
    await this.userRepository
      .update(id, { amount: user.amount - transferKfcDto.amount })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    await this.neosService.sendMessage(
      id,
      `${user.userName} 様へ ${transferKfcDto.amount} KFC振り込みました。`,
    );
    return user.amount - transferKfcDto.amount;
  }

  async checkIp(id: string, ip: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!user) {
      return false;
    }
    if (user.ipAddress === ip) {
      return true;
    } else {
      throw new ForbiddenException(`IPチェックに失敗しました。`);
    }
  }
}
