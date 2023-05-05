import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators';

export class UpdateTokenDto {
  @ApiProperty({
    example: 'U-hinanoaira',
    description: 'トークンの所持者(Member以上の権限が必要)',
  })
  @ApiPropertyOptional()
  owner?: string;

  @ApiProperty({ example: '1.0', description: '対KFCのレート' })
  @ApiPropertyOptional()
  rate?: number;

  @ApiProperty({ example: true, description: 'IPチェックを行うか' })
  @ApiPropertyOptional()
  checkingIp?: boolean;
}
