import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterSkinDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'SlotSkin-01', description: 'SkinID' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'neosdb://', description: 'SkinURL' })
  url: string;
}
