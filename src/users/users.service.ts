import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NeosService } from 'src/neos/neos.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly neosService: NeosService,
  ) {}
  async create(createUserDto: CreateUserDto, Ip: string) {
    const id = createUserDto.id;
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      if (user.userName == createUserDto.userName) {
        throw new ConflictException(`すでに口座があります。`);
      } else {
        await this.userRepository
          .update(id, { userName: createUserDto.userName })
          .catch((e) => {
            throw new InternalServerErrorException(e.message);
          });
        return 'ユーザーネームを変更しました。';
      }
    }
    await this.userRepository
      .save({
        id: createUserDto.id,
        userName: createUserDto.userName,
        ipAddress: Ip,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return '口座を開設しました。';
  }

  async fromId(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new ForbiddenException(`${user}は見つかりませんでした。`);
    }

    return user.userName;
  }
  async resetIp(id: string) {
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!user) {
      throw new ForbiddenException(`${id}の口座はありません。`);
    }
    const code = ('0000' + Math.floor(Math.random() * 100)).slice(-4);
    await this.userRepository.update(id, { oneTimeCode: code }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    this.neosService.sendMessage(
      id,
      `以下のコードを入力してください。\nPlease enter this code.\n${code}`,
    );
  }
  async entryCode(id: string, code: string, ip: string) {
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!user) {
      throw new ForbiddenException(`${id}の口座はありません。`);
    }
    if (user.oneTimeCode !== code) {
      throw new ForbiddenException(`認証コードが間違っています。`);
    }
    await this.userRepository
      .update(id, { oneTimeCode: '', ipAddress: ip })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    this.neosService.sendMessage(
      id,
      `IP登録情報を更新しました。\nThe registered IP has been updated.`,
    );
  }
}
