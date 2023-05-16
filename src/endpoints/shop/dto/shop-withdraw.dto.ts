import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import Big from 'big.js';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Min, IsNumber } from 'class-validator';

export class ShopWithdrawDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'U-hinanoaira', description: 'NeosユーザーID' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'HinaSense', description: 'ショップの名前' })
  shopName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 100, description: '金額' })
  @Transform(({ value }) => new Big(value))
  amount: Big;
}
