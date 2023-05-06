import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { RankingService } from './ranking.service';

@Controller('ranking')
@ApiTags('/ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('get-entries/:token/:tag')
  @HttpCode(200)
  @ApiOperation({ summary: 'ランキングを取得する' })
  @ApiParam({
    name: 'token',
    type: String,
    example: 'QCR',
  })
  @ApiParam({
    name: 'tag',
    type: String,
    example: '20220400',
  })
  async getEntries(@Param('token') token: string, @Param('tag') tag: string) {
    return await this.rankingService.getEntries(token, tag);
  }
}
