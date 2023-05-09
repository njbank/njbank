import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class TransactionTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'U-hinanoaira', description: 'NeosユーザーID' })
  id: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 100, description: '金額' })
  amount: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    default: false,
    description: 'ランキング反映',
    required: false,
  })
  isRanking: boolean;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({
    example: [],
    description: '反映するランキング一覧',
    required: false,
  })
  tags: string[];
}
