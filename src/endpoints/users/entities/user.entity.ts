import Big from 'big.js';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { ColumnNumericTransformer } from '../../../transformer/column-numeric.transformer';

import { Role } from './role.entity';

@Entity('User')
export class User {
  @PrimaryColumn()
  id: string;
  @Column()
  userName: string;
  @Column({ default: 'Guest' })
  role: Role;
  @Column()
  ipAddress: string;
  @Column('decimal', {
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  amount: Big;
  @Column('jsonb', { default: {} })
  tokens: { [index: string]: number }[];
  @Column({ default: '' })
  oneTimeCode: string;
  @Column('jsonb', { default: [] })
  skin: string[];
}
