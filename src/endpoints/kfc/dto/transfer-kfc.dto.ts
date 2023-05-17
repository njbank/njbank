import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import Big from 'big.js';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

enum Dest {
  bank = 'bank',
  account = 'account',
}

export class TransferKfcDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'U-hinanoaira', description: '送り元NeosユーザーID' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'U-kazu', description: '送り先NeosユーザーID' })
  to: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 100, description: '金額' })
  @Type(() => Big)
  amount: Big;

  @IsNotEmpty()
  @IsEnum(Dest)
  @ApiProperty({ enum: Dest, description: '送り先' })
  dest: Dest;
}
