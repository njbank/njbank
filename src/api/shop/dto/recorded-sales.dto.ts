import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class RecordedSalesDto {
  @ApiProperty({ example: 'HinaSense', description: 'ショップの名前' })
  shopName: string;
}
