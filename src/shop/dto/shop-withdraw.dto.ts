import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class ShopWithdrawDto {
  @ApiProperty({ example: 'U-hinanoaira', description: 'NeosユーザーID' })
  id: string;

  @ApiProperty({ example: 'HinaSense', description: 'ショップの名前' })
  shopName: string;

  @ApiProperty({ example: 100, description: '金額' })
  amount: number;
}
