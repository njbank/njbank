import { Controller } from '@nestjs/common';
import { NeosService } from './neos.service';

@Controller('neos')
export class NeosController {
  constructor(private readonly neosService: NeosService) {}

  async sendMessage(id: string, message: string) {
    this.neosService.sendMessage(id, message);
  }
}
