import { Controller } from '@nestjs/common';

import { NeosService } from './neos.service';

@Controller('neos')
export class NeosController {
  constructor(private readonly neosService: NeosService) {}

  async sendMessage(id: string, message: string) {
    await this.neosService.sendMessage(id, message);
  }

  async sendKfc(id: string, amount: number, comment?: string, totp?: string) {
    await this.neosService.sendKfc(id, amount, comment, totp);
  }

  async friendRequest(id: string) {
    await this.neosService.friendRequest(id);
  }
}
