import { IncomingMessage } from 'http';
import url from 'url';

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiKey } from './entities/api-key.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const apikey = req.query['apikey'];
    if (!apikey) {
      throw new UnauthorizedException('Unauthorized');
    }
    if (await this.validateApiKey(apikey, req)) {
      next();
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private apiKeys: string[] = ['x1jb520220hdvi71u7yv5bc0jf8wj634'];

  async validateApiKey(key: string, req: any) {
    if (this.apiKeys.find((e) => key === e)) {
      return true;
    }
    const apiKey = await this.getApiKey(key);
    if (!apiKey) {
      return false;
    }
    for (const permissionId of apiKey.permissions) {
      const permission = await this.getPermission(permissionId);
      if (!permission) {
        return false;
      }
      for (const allowedPaths of permission.allowedPaths) {
        const regExp = new RegExp(allowedPaths);
        if (regExp.exec(req.baseUrl)) {
          return true;
        }
      }
    }
    return false;
  }

  async getApiKey(key: string) {
    const apiKey = await this.apiKeyRepository.findOneBy({ key });
    return apiKey;
  }
  async getPermission(id: string) {
    const permission = await this.permissionRepository.findOneBy({ id });
    return permission;
  }
}
