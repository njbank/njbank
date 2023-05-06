import { Column, Entity, PrimaryColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger/dist/decorators';

import { Role } from './role.entity';

@Entity('User')
export class User {
  @PrimaryColumn()
  @ApiProperty({ example: 'U-hinanoaira', description: 'NeosユーザーID' })
  id: string;

  @Column()
  @ApiProperty({ example: 'hinano.aira', description: 'Neosユーザーネーム' })
  userName: string;

  @Column({ default: 'Guest' })
  @ApiProperty({ example: 'Guest', description: 'ユーザーロール' })
  role: Role;

  @Column()
  @ApiProperty({ example: '::1', description: 'IPアドレス' })
  ipAddress: string;

  @Column({ default: 0 })
  @ApiProperty({ example: 100, description: '残高' })
  amount: number;

  @Column('jsonb', { default: {} })
  @ApiProperty({ example: { QCR: 100 }, description: '持っているトークン' })
  tokens: { [index: string]: number }[];

  @ApiProperty({ example: '1234', description: 'ワンタイムコード' })
  @Column({ default: '' })
  oneTimeCode: string;
}
