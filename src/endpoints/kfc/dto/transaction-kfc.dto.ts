import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import Big from 'big.js';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionKfcDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'U-hinanoaira', description: 'NeosユーザーID' })
  id: string;

  @IsNotEmpty()
  @ApiProperty({ example: 100, description: '金額' })
  @Transform(({ value }) => new Big(value))
  amount: Big;
}
