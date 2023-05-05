import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger/dist';

@Controller('users')
@ApiTags('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({ summary: '口座開設' })
  @ApiResponse({
    status: 201,
    description: '口座が作成された',
  })
  @ApiResponse({
    status: 409,
    description: '口座が既に作成されている',
  })
  async create(@Body() createUserDto: CreateUserDto, @Req() request: Request) {
    return await this.usersService.create(createUserDto, request.ip);
  }

  @Get('/get/:id')
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
}
