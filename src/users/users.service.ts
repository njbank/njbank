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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
}
