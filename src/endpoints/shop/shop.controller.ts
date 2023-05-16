import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RecordedSalesDto } from './dto/recorded-sales.dto';
import { ShopTransactionDto } from './dto/shop-transaction.dto';
import { ShopWithdrawDto } from './dto/shop-withdraw.dto';
import { ShopService } from './shop.service';

@Controller('shop')
@ApiTags('/shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('payment')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  @ApiOperation({ summary: 'ショップに支払いする' })
  @ApiResponse({
    status: 200,
    description: '処理が正しく完了した',
  })
  async payment(@Body() shopTransactionDto: ShopTransactionDto) {
    return await this.shopService.payment(
      shopTransactionDto.id,
      shopTransactionDto.shopName,
      shopTransactionDto.amount,
      shopTransactionDto.shopAnnounce,
      shopTransactionDto.userAnnounce,
    );
  }

  @Post('receipt')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  @ApiOperation({ summary: 'ショップから返金する' })
  @ApiResponse({
    status: 200,
    description: '処理が正しく完了した',
  })
  async receipt(@Body() shopTransactionDto: ShopTransactionDto) {
    return await this.shopService.receipt(
      shopTransactionDto.id,
      shopTransactionDto.shopName,
      shopTransactionDto.amount,
      shopTransactionDto.shopAnnounce,
      shopTransactionDto.userAnnounce,
    );
  }

  @Post('deposit')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  @ApiOperation({ summary: 'ショップに入金する' })
  @ApiResponse({
    status: 200,
    description: '処理が正しく完了した',
  })
  async deposit(@Body() shopTransactionDto: ShopTransactionDto) {
    return await this.shopService.deposit(
      shopTransactionDto.id,
      shopTransactionDto.shopName,
      shopTransactionDto.amount,
      shopTransactionDto.shopAnnounce,
      shopTransactionDto.userAnnounce,
    );
  }

  @Post('withdraw')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  @ApiOperation({ summary: 'ショップから出金する' })
  @ApiResponse({
    status: 200,
    description: '処理が正しく完了した',
  })
  async withdraw(@Body() shopWithdrawDto: ShopWithdrawDto) {
    return await this.shopService.withdraw(
      shopWithdrawDto.id,
      shopWithdrawDto.shopName,
      shopWithdrawDto.amount,
    );
  }

  @Post('recorded-sales-force')
  @HttpCode(200)
  @ApiOperation({ summary: 'ショップの売り上げ処理を強制的に行う' })
  @ApiResponse({
    status: 200,
    description: '処理が正しく完了した',
  })
  async recordedSalesForce(@Body() recordedSalesDto: RecordedSalesDto) {
    await this.shopService.recordedSalesByName(recordedSalesDto.shopName);
    return '処理が完了しました。';
  }

  @Post('recorded-sales-batch')
  @HttpCode(200)
  @ApiExcludeEndpoint()
  async recordedSalesBatch() {
    await this.shopService.recordedSalesBatch();
    return '処理が完了しました。';
  }
}
