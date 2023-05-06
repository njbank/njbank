import { RealIP } from 'nestjs-real-ip';

import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BuyTokenDto } from './dto/buy-token.dto';
import { CreateTokenDto } from './dto/create-token.dto';
import { DepositTokenDto } from './dto/deposit-token.dto';
import { TransferTokenDto } from './dto/transfer-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { WithdrawTokenDto } from './dto/withdraw-token.dto';
import { TokenService } from './token.service';

@Controller('token')
@ApiTags('/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('create')
  @HttpCode(201)
  @ApiOperation({ summary: 'トークン作成' })
  @ApiResponse({
    status: 201,
    description: 'トークンが作成された',
  })
  @ApiResponse({
    status: 409,
    description: 'トークンが既に作成されている',
  })
  async create(@Body() createTokenDto: CreateTokenDto) {
    return await this.tokenService.create(createTokenDto);
  }

  @Post(':token/update')
  @HttpCode(200)
  @ApiOperation({ summary: 'トークン更新' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async update(
    @Param('token') token: string,
    @Body() updateTokenDto: UpdateTokenDto,
  ) {
    return await this.tokenService.updateToken(updateTokenDto, token);
  }

  @Get(':token/check/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'トークン残高を確認' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'U-hinanoaira',
  })
  @ApiResponse({
    status: 200,
    description: '所持金を返答',
  })
  async check(
    @Param('token') token: string,
    @Param('id') id: string,
    @RealIP() ipAddress: string,
  ) {
    return await this.tokenService.checkToken(id, token, ipAddress);
  }

  @Post(':token/deposit')
  @HttpCode(200)
  @ApiOperation({ summary: 'トークンを預ける' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async deposit(
    @Param('token') token: string,
    @Body() depositTokenDto: DepositTokenDto,
    @RealIP() ipAddress: string,
  ) {
    return await this.tokenService.depositToken(
      depositTokenDto,
      token,
      ipAddress,
    );
  }

  @Post(':token/withdraw')
  @HttpCode(200)
  @ApiOperation({ summary: 'トークンを引き出す' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async withdraw(
    @Param('token') token: string,
    @Body() withdrawToken: WithdrawTokenDto,
    @RealIP() ipAddress: string,
  ) {
    return await this.tokenService.withdrawToken(
      withdrawToken,
      token,
      ipAddress,
    );
  }

  @Post(':token/transfer')
  @HttpCode(200)
  @ApiOperation({ summary: 'トークンを送金する' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async transfer(
    @Param('token') token: string,
    @Body() transferTokenDto: TransferTokenDto,
    @RealIP() ipAddress: string,
  ) {
    return await this.tokenService.transferToken(
      transferTokenDto,
      token,
      ipAddress,
    );
  }

  @Post(':token/buy')
  @HttpCode(200)
  @ApiOperation({ summary: 'トークンを購入する' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async buy(
    @Param('token') token: string,
    @Body() buyTokenDto: BuyTokenDto,
    @RealIP() ipAddress: string,
  ) {
    return await this.tokenService.buyToken(buyTokenDto, token, ipAddress);
  }
}
