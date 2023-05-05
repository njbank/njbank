import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class CreateTokenDto {
  @ApiProperty({ example: 'QCR', description: 'トークンの名前' })
  name: string;

  @ApiProperty({
    example: 'U-hinanoaira',
    description: 'トークンの所持者(Member以上の権限が必要)',
  })
  owner: string;

  @ApiProperty({ example: '1.0', description: '対KFCのレート' })
  rate: number;

  @ApiProperty({ example: true, description: 'IPチェックを行うか' })
  checkingIp: boolean;
}
