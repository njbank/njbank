import { Injectable } from '@nestjs/common';

import { ShopService } from './endpoints/shop/shop.service';

@Injectable()
export class FactoryService {
  constructor(private readonly shopService: ShopService) {}
  async exec(): Promise<string> {
    await this.shopService.recordedSalesBatch();
    return 'done!';
  }
}
