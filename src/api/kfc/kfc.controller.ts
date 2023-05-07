import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { RealIP } from 'nestjs-real-ip';

import { DepositKfcDto } from './dto/deposit-kfc.dto';
import { TransferKfcDto } from './dto/transfer-kfc.dto';
import { WithdrawKfcDto } from './dto/withdraw-kfc.dto';
import { KfcService } from './kfc.service';

@Controller('kfc')
@ApiTags('/kfc')
export class KfcController {
  constructor(private readonly kfcService: KfcService) {}

  @Get('check/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'KFC残高を確認' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'U-hinanoaira',
  })
  @ApiResponse({
    status: 200,
    description: '所持金を返答',
  })
  async check(@Param('id') id: string, @RealIP() ipAddress: string) {
    return await this.kfcService.checkKfc(id, ipAddress);
  }

  @Post('deposit')
  @HttpCode(200)
  @ApiOperation({ summary: 'KFCを預ける' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async deposit(
    @Body() depositKefDto: DepositKfcDto,
    @RealIP() ipAddress: string,
  ) {
    return await this.kfcService.depositKfc(depositKefDto, ipAddress);
  }

  @Post('withdraw')
  @HttpCode(200)
  @ApiOperation({ summary: 'KFCを引き出す' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async withdraw(
    @Body() withdrawKfcDto: WithdrawKfcDto,
    @RealIP() ipAddress: string,
  ) {
    return await this.kfcService.withdrawKfc(withdrawKfcDto, ipAddress);
  }

  @Post('transfer')
  @HttpCode(200)
  @ApiOperation({ summary: 'KFCを送金する' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async transfer(
    @Body() transferKfcDto: TransferKfcDto,
    @RealIP() ipAddress: string,
  ) {
    return await this.kfcService.transferKfc(transferKfcDto, ipAddress);
  }
}
