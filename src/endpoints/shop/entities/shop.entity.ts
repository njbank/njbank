import Big from 'big.js';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ColumnNumericTransformer } from '../../../transformer/column-numeric.transformer';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  shopName: string;
  @Column()
  owner: string;
  @Column('jsonb', { default: [] })
  member: string[];
  @Column('decimal', {
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  amount: Big;
  @Column('decimal', {
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  lastAmount: Big;
  @Column('jsonb', { default: {} })
  autoSendAddress: { [index: string]: number }[];
  @Column('decimal', {
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  autoSendToBeLeft: Big;
}
