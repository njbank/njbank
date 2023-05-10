import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class BuyTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'U-hinanoaira', description: 'NeosユーザーID' })
  id: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 100, description: '金額' })
  amount: number;
}
