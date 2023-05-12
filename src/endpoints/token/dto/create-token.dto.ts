import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { RankingType } from '../entities/ranking-type.entity';

export class CreateTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'QCR', description: 'トークンの名前' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'U-hinanoaira',
    description: 'トークンの所持者(Member以上の権限が必要)',
  })
  owner: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @ApiProperty({ example: '1.0', description: '対KFCのレート' })
  rate: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true, description: 'IPチェックを行うか' })
  checkingIp: boolean;

  @IsOptional()
  @IsEnum(RankingType)
  @ApiProperty({ enum: RankingType, description: '常に行うランキングの期間' })
  @ApiPropertyOptional()
  rankingType?: RankingType;
}
