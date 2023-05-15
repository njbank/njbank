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
    description: 'トークン',
  })
  @ApiParam({
    name: 'tag',
    type: String,
    example: '2023-05',
    description: 'ランキングタグ',
  })
  async getEntries(@Param('token') token: string, @Param('tag') tag: string) {
    return await this.rankingService.getEntries(token, tag);
  }
}
