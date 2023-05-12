import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { RankingType } from '../entities/ranking-type.entity';

export class UpdateTokenDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'U-hinanoaira',
    description: 'トークンの所持者(Member以上の権限が必要)',
  })
  @ApiPropertyOptional()
  owner?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @ApiProperty({ example: '1.0', description: '対KFCのレート' })
  @ApiPropertyOptional()
  rate?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'IPチェックを行うか',
    required: false,
  })
  checkingIp?: boolean;

  @IsOptional()
  @IsEnum(RankingType)
  @ApiProperty({
    enum: RankingType,
    description: '常に行うランキングの期間',
    required: false,
  })
  rankingType?: RankingType;
}
