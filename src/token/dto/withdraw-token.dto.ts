import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class WithdrawTokenDto {
  @ApiProperty({ example: 'U-hinanoaira', description: 'NeosユーザーID' })
  id: string;

  @ApiProperty({ example: 100, description: '金額' })
  amount: number;
}
