import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators';

enum Dest {
  bank = 'bank',
  account = 'account',
}

export class TransferKfcDto {
  @ApiProperty({ example: 'U-hinanoaira', description: 'NeosユーザーID' })
  id: string;

  @ApiProperty({ example: 'U-kazu', description: 'NeosユーザーID' })
  to: string;

  @ApiProperty({ example: 100, description: '金額' })
  amount: number;

  @ApiProperty({ enum: Dest, description: '送信先' })
  @ApiPropertyOptional()
  dest?: Dest;
}
