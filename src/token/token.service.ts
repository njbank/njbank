import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { DepositTokenDto } from './dto/deposit-token.dto';
import { WithdrawTokenDto } from './dto/withdraw-token.dto';
import { TransferTokenDto } from './dto/transfer-token.dto';
import { BuyTokenDto } from './dto/buy-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createTokenDto: CreateTokenDto) {
    const name = createTokenDto.name;
    const token = await this.tokenRepository.findOneBy({ name }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (token) {
      throw new ConflictException(`既に${token}は存在します。`);
    }
    await this.tokenRepository
      .save({
        name: createTokenDto.name,
        owner: createTokenDto.owner,
        rate: createTokenDto.rate,
        checkingIp: createTokenDto.checkingIp,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return `${name}を作成しました。`;
  }

  async updateToken(updateTokenDto: UpdateTokenDto, name: string) {
    const token = await this.tokenRepository.findOneBy({ name }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!token) {
      throw new ForbiddenException(`${token}は存在しません。`);
    }
    await this.tokenRepository
      .update(name, {
        owner: updateTokenDto.owner,
        rate: updateTokenDto.rate,
        checkingIp: updateTokenDto.checkingIp,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return '更新しました。';
  }

  async checkToken(Id: string, name: string) {
    const id = Id;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new ForbiddenException(`${id}の口座は存在しません。`);
    }
    const token = await this.tokenRepository.findOneBy({ name }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!token) {
      throw new ForbiddenException(`${name}は存在しません。`);
    }
    if (!user.tokens[name]) {
      return 0;
    }
    return user.tokens[name];
  }

  async depositToken(depositTokenDto: DepositTokenDto, name: string) {
    const id = depositTokenDto.id;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new ForbiddenException(`${id}の口座は存在しません。`);
    }
    const token = await this.tokenRepository.findOneBy({ name }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!token) {
      throw new ForbiddenException(`${name}は存在しません。`);
    }
    if (user.tokens[name]) {
      user.tokens[name] += depositTokenDto.amount;
    } else {
      user.tokens[name] = depositTokenDto.amount;
    }
    await this.userRepository
      .update(id, {
        tokens: user.tokens,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return user.tokens[name];
  }

  async withdrawToken(withdrawTokenDto: WithdrawTokenDto, name: string) {
    const id = withdrawTokenDto.id;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new ForbiddenException(`${id}の口座は存在しません。`);
    }
    const token = await this.tokenRepository.findOneBy({ name }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!token) {
      throw new ForbiddenException(`${name}は存在しません。`);
    }
    if (user.tokens[name] && user.tokens[name] >= withdrawTokenDto.amount) {
      user.tokens[name] -= withdrawTokenDto.amount;
    } else {
      throw new ForbiddenException(`${name}が足りません。`);
    }
    await this.userRepository
      .update(id, {
        tokens: user.tokens,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return user.tokens[name];
  }

  async transferToken(tranferTokenDto: TransferTokenDto, token: string) {
    return `Todo`;
  }

  async buyToken(buyTokenDto: BuyTokenDto, name: string) {
    const id = buyTokenDto.id;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new ForbiddenException(`${id}の口座は存在しません。`);
    }
    const token = await this.tokenRepository.findOneBy({ name }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!token) {
      throw new ForbiddenException(`${name}は存在しません。`);
    }
    if (user.amount < buyTokenDto.amount * token.rate) {
      throw new ForbiddenException(`KFCが足りません。`);
    }
    if (user.tokens[name]) {
      user.tokens[name] += buyTokenDto.amount;
    } else {
      user.tokens[name] = buyTokenDto.amount;
    }
    await this.userRepository
      .update(id, {
        tokens: user.tokens,
        amount: user.amount - buyTokenDto.amount * token.rate,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return user.tokens[name];
  }
}
