import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Token')
export class Token {
  @PrimaryColumn()
  @ApiProperty({ example: 'QCR', description: 'トークンの名前' })
  name: string;

  @Column()
  @ApiProperty({ example: 'U-hinanoaira', description: 'トークンの所有者' })
  owner: string;

  @Column('decimal', { precision: 6, scale: 2 })
  @ApiProperty({ example: '1.0', description: '対KFCのレート' })
  rate: number;

  @Column()
  @ApiProperty({ example: true, description: 'IPチェックを行うか' })
  checkingIp: boolean;
}
