import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class TransferTokenDto {
  @ApiProperty({ example: 'U-hinanoaira', description: 'NeosユーザーID' })
  id: string;

  @ApiProperty({ example: 'U-kazu', description: 'NeosユーザーID' })
  to: string;

  @ApiProperty({ example: 100, description: '金額' })
  amount: number;
}
