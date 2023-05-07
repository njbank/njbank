import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RegisterSkinDto } from './dto/register-skin.dto';
import { Skin } from './entities/skin.entity';

@Injectable()
export class SkinService {
  constructor(
    @InjectRepository(Skin) private readonly skinRepository: Repository<Skin>,
  ) {}

  async listSkin() {
    const skins = await this.skinRepository.find().catch((e) => {
      throw new ForbiddenException(e.message);
    });
    const skinList: string[] = [];
    for (const item of skins) {
      skinList.push(item.id);
    }
    return skinList.join(',');
  }

  async getUrl(id: string) {
    const skin = await this.skinRepository.findOneBy({ id }).catch((e) => {
      throw new ForbiddenException(e.message);
    });
    if (!skin) {
      throw new ForbiddenException('登録されていません');
    }
    return skin.url;
  }

  async registerUrl(registerSkinDto: RegisterSkinDto) {
    const skin = await this.skinRepository
      .findOneBy({ id: registerSkinDto.id })
      .catch((e) => {
        throw new ForbiddenException(e.message);
      });
    if (skin) {
      await this.skinRepository
        .update(skin.id, { url: registerSkinDto.url })
        .catch((e) => {
          throw new ForbiddenException(e.message);
        });
    } else {
      await this.skinRepository.save({
        id: registerSkinDto.id,
        url: registerSkinDto.url,
      });
    }
    return '登録完了';
  }
}
