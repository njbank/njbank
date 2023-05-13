import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiExcludeEndpoint()
  async getHello() {
    return this.appService.getHello();
  }

  @Get('status')
  @ApiOperation({ summary: 'サーバーステータス確認' })
  @ApiResponse({
    status: 200,
    description: 'サービス中',
  })
  async status() {
    return 'OK';
  }
}
