import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { KfcService } from './kfc.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger/dist';
import { DepositKfcDto } from './dto/deposit-kfc.dto';
import { WithdrawKfcDto } from './dto/withdraw-kfc.dto';
import { TransferKfcDto } from './dto/transfer-kfc.dto';
import { IpAddress } from 'src/request-ip/request-ip.decorator';

@Controller('kfc')
@ApiTags('/kfc')
export class KfcController {
  constructor(private readonly kfcService: KfcService) {}

  @Get('check/:id')
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
  async check(@Param('id') id: string, @IpAddress() ipAddress: string) {
    return await this.kfcService.checkKfc(id, ipAddress);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'KFCを預ける' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async deposit(
    @Body() depositKefDto: DepositKfcDto,
    @IpAddress() ipAddress: string,
  ) {
    return await this.kfcService.depositKfc(depositKefDto, ipAddress);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'KFCを引き出す' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async withdraw(
    @Body() withdrawKfcDto: WithdrawKfcDto,
    @IpAddress() ipAddress: string,
  ) {
    return await this.kfcService.withdrawKfc(withdrawKfcDto, ipAddress);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'KFCを送金する' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async transfer(
    @Body() transferKfcDto: TransferKfcDto,
    @IpAddress() ipAddress: string,
  ) {
    return await this.kfcService.transferKfc(transferKfcDto, ipAddress);
  }
}
