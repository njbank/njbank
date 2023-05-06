import { RealIP } from 'nestjs-real-ip';

import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @HttpCode(201)
  @ApiOperation({ summary: '口座開設' })
  @ApiResponse({
    status: 201,
    description: '口座が作成された',
  })
  @ApiResponse({
    status: 409,
    description: '口座が既に作成されている',
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @RealIP() ipAddress: string,
  ) {
    return await this.usersService.create(createUserDto, ipAddress);
  }

  @Get('/get/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'IDからユーザーネームを確認' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'U-hinanoaira',
  })
  @ApiResponse({
    status: 200,
    description: 'ユーザーネームを返答',
  })
  async fromId(@Param('id') id: string) {
    return await this.usersService.fromId(id);
  }

  @Get('reset-ip/:id')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: String,
    example: 'U-hinanoaira',
  })
  @ApiResponse({
    status: 200,
    description: '処理が正しく完了した',
  })
  async resetIp(@Param('id') id: string) {
    return await this.usersService.resetIp(id);
  }

  @Get('entry-code/:id/:code')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: String,
    example: 'U-hinanoaira',
  })
  @ApiParam({
    name: 'code',
    type: String,
    example: '1234',
  })
  @ApiResponse({
    status: 200,
    description: '処理が正しく完了した',
  })
  async entryCode(
    @Param('id') id: string,
    @Param('code') code: string,
    @RealIP() ipAddress: string,
  ) {
    return await this.usersService.entryCode(id, code, ipAddress);
  }
}
