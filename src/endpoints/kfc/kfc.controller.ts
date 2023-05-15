import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';

import { CfIp } from '../../modules/cf-ip/cf-ip';

import { TransactionKfcDto } from './dto/transaction-kfc.dto';
import { TransferKfcDto } from './dto/transfer-kfc.dto';
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
    description: 'NeosユーザーID',
  })
  @ApiResponse({
    status: 200,
    description: '所持金を返答',
  })
  async check(@Param('id') id: string, @CfIp() ipAddress: string) {
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
    @Body() transactionKfcDto: TransactionKfcDto,
    @CfIp() ipAddress: string,
  ) {
    return await this.kfcService.depositKfc(transactionKfcDto, ipAddress);
  }

  @Post('withdraw')
  @HttpCode(200)
  @ApiOperation({ summary: 'KFCを引き出す' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async withdraw(
    @Body() transactionKfcDto: TransactionKfcDto,
    @CfIp() ipAddress: string,
  ) {
    return await this.kfcService.withdrawKfc(transactionKfcDto, ipAddress);
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
    @CfIp() ipAddress: string,
  ) {
    return await this.kfcService.transferKfc(transferKfcDto, ipAddress);
  }
}
