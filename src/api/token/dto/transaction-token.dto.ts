import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators';

export class TransactionTokenDto {
  @ApiProperty({ example: 'U-hinanoaira', description: 'NeosユーザーID' })
  id: string;

  @ApiProperty({ example: 100, description: '金額' })
  amount: number;

  @ApiProperty({ example: false, description: 'ランキング反映' })
  @ApiPropertyOptional()
  isRanking: boolean;

  @ApiProperty({ example: [], description: '反映するランキング一覧' })
  @ApiPropertyOptional()
  tags: string[];
}
