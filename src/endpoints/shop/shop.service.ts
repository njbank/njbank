import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Big from 'big.js';
import { Repository } from 'typeorm';

import { NeosService } from '../../modules/neos/neos.service';
import { KfcService } from '../kfc/kfc.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { Shop } from './entities/shop.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    private readonly neosService: NeosService,
    private readonly usersService: UsersService,
    private readonly kfcService: KfcService,
  ) {}

  //async create() {}

  //async update() {}

  //async check() {}

  async payment(
    id: string,
    shopName: string,
    amount: Big,
    shopAnnounce = true,
    userAnnounce = true,
  ) {
    let user = await this.usersService.getUser(id);
    let shop = await this.getShop(shopName);
    user = await this.kfcService.removeKfc(user, amount);
    shop = await this.addKfc(shop, amount);
    if (userAnnounce) {
      await this.neosService.sendMessage(
        user.id,
        `${shop.shopName} に ${amount} KFC支払いました。\n残高 ${user.amount} KFC`,
      );
    }
    if (shopAnnounce) {
      await this.neosService.sendMessage(
        shop.owner,
        `${user.userName} 様より ${shop.shopName} へ ${amount} KFCの支払いがありました。\n残高 ${shop.amount} KFC`,
      );
    }
    return '支払いが完了しました。';
  }

  async receipt(
    id: string,
    shopName: string,
    amount: Big,
    shopAnnounce = true,
    userAnnounce = true,
  ) {
    let user = await this.usersService.getUser(id);
    let shop = await this.getShop(shopName);
    shop = await this.removeKfc(shop, amount);
    user = await this.kfcService.addKfc(user, amount);
    if (userAnnounce) {
      await this.neosService.sendMessage(
        user.id,
        `${shop.shopName} から ${amount} KFC送金されました。\n残高 ${user.amount} KFC`,
      );
    }
    if (shopAnnounce) {
      await this.neosService.sendMessage(
        shop.owner,
        `${shop.shopName} から ${user.userName} 様へ ${amount} KFC支払いました。\n残高 ${shop.amount} KFC`,
      );
    }
    return '支払いが完了しました。';
  }

  async deposit(
    id: string,
    shopName: string,
    amount: Big,
    shopAnnounce = true,
    userAnnounce = true,
  ) {
    const user = await this.usersService.getUser(id);
    if (!(await this.neosService.KfcCheck(user.id, amount.toNumber()))) {
      throw new ForbiddenException('入金に失敗しました。');
    }
    let shop = await this.getShop(shopName);
    shop = await this.addKfc(shop, amount);
    if (userAnnounce) {
      await this.neosService.sendMessage(
        user.id,
        `${shop.shopName} に ${amount} KFC入金しました。`,
      );
    }
    if (shopAnnounce) {
      await this.neosService.sendMessage(
        shop.owner,
        `${user.userName} 様より ${shop.shopName} へ ${amount} KFC入金がありました。\n残高 ${shop.amount} KFC`,
      );
    }
    return '入金が完了しました。';
  }

  async withdraw(id: string, shopName: string, amount: Big) {
    const user = await this.usersService.getUser(id);
    let shop = await this.getShop(shopName);
    if (shop.amount < amount) {
      throw new ForbiddenException('KFCが足りません');
    }
    await this.neosService.sendKfc(
      user.id,
      amount.toNumber(),
      `${shop.shopName} から ${amount} KFCの出金を行いました。`,
    );
    shop = await this.removeKfc(shop, amount);
    await this.neosService.sendMessage(
      shop.owner,
      `${shop.shopName} から ${user.userName} 様へ ${amount} KFCの出金を行いました。\n残高 ${shop.amount} KFC`,
    );
    return '出金が完了しました。';
  }

  async recordedSalesByName(shopName: string) {
    const shop = await this.getShop(shopName);
    await this.recordedSales(shop);
  }

  async recordedSales(shop: Shop) {
    const users: { user: User; amount: Big }[] = [];
    const count = Object.keys(shop.autoSendAddress).length;
    for (const key in shop.autoSendAddress) {
      const amount = shop.amount.minus(shop.autoSendToBeLeft).div(count);
      if (amount !== new Big(0)) {
        users.push({
          user: await this.usersService.getUser(key),
          amount: shop.amount.minus(shop.autoSendToBeLeft).div(count),
        });
      }
    }
    if (users.length === 0) {
      return;
    }
    let shopBalance = shop.amount;
    for (const item of users) {
      await this.removeKfc(shop, item.amount);
      await this.neosService.sendKfc(
        item.user.id,
        item.amount.toNumber(),
        `${shop.shopName} から ${item.amount} KFCの出金を行いました。`,
      );
      shopBalance = shopBalance.minus(item.amount);
    }
    await this.neosService.sendMessage(
      shop.owner,
      `${shop.shopName} 売り上げ報告\n前回より${shop.amount.minus(
        shop.lastAmount,
      )} KFC の売り上げがありました。`,
    );
    for (const item of users) {
      await this.neosService.sendMessage(
        shop.owner,
        `出金 ${item.user.userName} : ${item.amount}`,
      );
    }
    await this.shopRepository
      .update(shop.id, { lastAmount: shopBalance })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    return;
  }

  async recordedSalesBatch() {
    const shops = await this.shopRepository.find();
    for (const shop of shops) {
      await this.recordedSales(shop);
    }
    return 'done';
  }

  async getShop(shopName: string) {
    const shop = await this.shopRepository
      .findOneBy({ shopName })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    if (!shop) {
      throw new ForbiddenException(`${shopName}は存在しません。`);
    }
    return shop;
  }

  async addKfc(shop: Shop, amount: Big) {
    if (shop.amount === new Big(-1)) {
      return shop;
    }
    await this.shopRepository
      .update(shop.id, { amount: shop.amount.plus(amount).toString() })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    shop.amount = shop.amount.plus(amount);
    return shop;
  }

  async removeKfc(shop: Shop, amount: Big) {
    if (shop.amount === new Big(-1)) {
      return shop;
    }
    if (shop.amount < amount) {
      throw new ForbiddenException('KFCが足りません');
    }
    await this.shopRepository
      .update(shop.id, { amount: shop.amount.minus(amount).toString() })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    shop.amount = shop.amount.minus(amount);
    return shop;
  }
}
