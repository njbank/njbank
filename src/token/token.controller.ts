import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TransferTokenDto } from './dto/transfer-token.dto';
import { WithdrawTokenDto } from './dto/withdraw-token.dto';
import { DepositTokenDto } from './dto/deposit-token.dto';
import { BuyTokenDto } from './dto/buy-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@Controller('token')
@ApiTags('/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('create')
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
  async check(@Param('token') token: string, @Param('id') id: string) {
    return await this.tokenService.checkToken(id, token);
  }

  @Post(':token/deposit')
  @ApiOperation({ summary: 'トークンを預ける' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async deposit(
    @Param('token') token: string,
    @Body() depositTokenDto: DepositTokenDto,
  ) {
    return await this.tokenService.depositToken(depositTokenDto, token);
  }

  @Post(':token/withdraw')
  @ApiOperation({ summary: 'トークンを引き出す' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async withdraw(
    @Param('token') token: string,
    @Body() withdrawToken: WithdrawTokenDto,
  ) {
    return await this.tokenService.withdrawToken(withdrawToken, token);
  }

  @Post(':token/transfer')
  @ApiOperation({ summary: 'トークンを送金する' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async transfer(
    @Param('token') token: string,
    @Body() transferTokenDto: TransferTokenDto,
  ) {
    return await this.tokenService.transferToken(transferTokenDto, token);
  }

  @Post(':token/buy')
  @ApiOperation({ summary: 'トークンを購入する' })
  @ApiResponse({
    status: 200,
    description: '処理が正常に完了した',
  })
  async buy(@Param('token') token: string, @Body() buyTokenDto: BuyTokenDto) {
    return await this.tokenService.buyToken(buyTokenDto, token);
  }
}