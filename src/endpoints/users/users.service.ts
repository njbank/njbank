import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NeosService } from '../../modules/neos/neos.service';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly neosService: NeosService,
  ) {}

  async create(createUserDto: CreateUserDto, Ip: string) {
    const id = createUserDto.id;
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
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
    await this.neosService.friendRequest(id);
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
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });

    if (!user) {
      throw new ForbiddenException(`${id}は見つかりませんでした。`);
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
    const code = ('0000' + Math.floor(Math.random() * 9999)).slice(-4);
    await this.userRepository.update(id, { oneTimeCode: code }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    this.neosService.sendMessage(
      id,
      `以下のコードを入力してください。\nPlease enter this code.`,
    );
    this.neosService.sendMessage(id, `${code}`);
    return 'コードを送信しました';
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
    return 'IP登録情報を更新しました';
  }

  async listSkin(id: string) {
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!user) {
      throw new ForbiddenException(`${id}の口座はありません。`);
    }
    user.skin.sort();
    user.skin.unshift('NONE');
    return user.skin.join(',');
  }

  async addSkin(id: string, skin: string) {
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!user) {
      throw new ForbiddenException(`${id}の口座はありません。`);
    }
    if (user.skin.includes(skin)) {
      throw new ForbiddenException(`既に登録されています。`);
    }
    user.skin.push(skin);
    user.skin.sort();
    await this.userRepository
      .update(user.id, { skin: user.skin })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return '登録しました';
  }

  async delSkin(id: string, skin: string) {
    const user = await this.userRepository.findOneBy({ id }).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!user) {
      throw new ForbiddenException(`${id}の口座はありません。`);
    }
    if (!user.skin.includes(skin)) {
      throw new ForbiddenException(`そのスキンはありません。`);
    }
    user.skin.sort();
    await this.userRepository
      .update(user.id, {
        skin: user.skin.filter((item) => {
          return item !== skin;
        }),
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return '削除しました';
  }

  async getUser(id: string, userName = false): Promise<User> {
    let user: User;
    if (userName) {
      user = await this.userRepository
        .findOneBy({ userName: id })
        .catch((e) => {
          throw new InternalServerErrorException(e.message);
        });
    } else {
      user = await this.userRepository.findOneBy({ id }).catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    }
    if (!user) {
      throw new ForbiddenException(`${id}の口座はありません。`);
    }
    return user;
  }

  async checkIp(id: string, ip: string): Promise<boolean> {
    const user = await this.getUser(id);
    if (user.ipAddress === ip || ip === '::beef') {
      return true;
    } else {
      throw new ForbiddenException(`IPチェックに失敗しました。`);
    }
  }
}
