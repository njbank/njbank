import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class TransactionKfcDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'U-hinanoaira', description: 'NeosユーザーID' })
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 100, description: '金額' })
  amount: number;
}
