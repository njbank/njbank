import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty, IsString } from 'class-validator';

export class RecordedSalesDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'HinaSense', description: 'ショップの名前' })
  shopName: string;
}
