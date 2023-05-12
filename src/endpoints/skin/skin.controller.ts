import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { string } from 'joi';

import { RegisterSkinDto } from './dto/register-skin.dto';
import { SkinService } from './skin.service';

@Controller('skin')
@ApiTags('/skin')
export class SkinController {
  constructor(private readonly skinService: SkinService) {}

  @Get('list')
  @ApiOperation({ summary: '登録されているスキンの一覧を取得します' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'スキン一覧を返答',
  })
  async list() {
    return await this.skinService.listSkin();
  }

  @Get('get/:id')
  @ApiOperation({ summary: 'スキンのURLを取得します' })
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: string,
    example: 'SlotSkin-01',
  })
  @ApiResponse({
    status: 200,
    description: 'URLを返答',
  })
  async get(@Param('id') id: string) {
    return await this.skinService.getUrl(id);
  }

  @Post('register')
  @ApiOperation({ summary: 'スキンを登録・更新します' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: '処理が正しく完了した',
  })
  async register(@Body() registerSkinDto: RegisterSkinDto) {
    return await this.skinService.registerUrl(registerSkinDto);
  }
}
