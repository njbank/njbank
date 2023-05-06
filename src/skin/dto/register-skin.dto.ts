import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class RegisterSkinDto {
  @ApiProperty({ example: 'SlotSkin-01', description: 'SkinID' })
  id: string;

  @ApiProperty({ example: 'neosdb://', description: 'SkinURL' })
  url: string;
}
