import { ApiProperty } from '@nestjs/swagger/dist/decorators';

enum Dest {
  bank = 'bank',
  account = 'account',
}

export class TransferKfcDto {
  @ApiProperty({ example: 'U-hinanoaira', description: '送り元NeosユーザーID' })
  id: string;

  @ApiProperty({ example: 'U-kazu', description: '送り先NeosユーザーID' })
  to: string;

  @ApiProperty({ example: 100, description: '金額' })
  amount: number;

  @ApiProperty({ enum: Dest, description: '送り先' })
  dest: Dest;
}
