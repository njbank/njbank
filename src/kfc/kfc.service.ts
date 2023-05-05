import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DepositKfcDto } from './dto/deposit-kfc.dto';
import { WithdrawKfcDto } from './dto/withdraw-kfc.dto';
import { TransferKfcDto } from './dto/transfer-kfc.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KfcService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async checkKfc(id: string, ipAddress: string) {
    await this.checkIp(id, ipAddress);
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new ForbiddenException(`${id}は見つかりませんでした。`);
    }
    return user.amount;
  }

  async depositKfc(depositKfcDto: DepositKfcDto, ipAddress: string) {
    const id = depositKfcDto.id;
    await this.checkIp(id, ipAddress);
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new ForbiddenException(`${id}は見つかりませんでした。`);
    }
    await this.userRepository
      .update(id, { amount: user.amount + depositKfcDto.amount })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return user.amount + depositKfcDto.amount;
  }

  async withdrawKfc(withdrawKfcDto: WithdrawKfcDto, ipAddress: string) {
    const id = withdrawKfcDto.id;
    await this.checkIp(id, ipAddress);
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new ForbiddenException(`${id}は見つかりませんでした。`);
    }
    if (user.amount < withdrawKfcDto.amount) {
      throw new ForbiddenException(`お金が足りません。`);
    }
    await this.userRepository
      .update(id, { amount: user.amount - withdrawKfcDto.amount })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return user.amount - withdrawKfcDto.amount;
  }

  async transferKfc(transferKfcDto: TransferKfcDto, ipAddress: string) {
    const id = transferKfcDto.id;
    await this.checkIp(id, ipAddress);
    return `Todo`;
  }

  async checkIp(id: string, ip: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id });
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
