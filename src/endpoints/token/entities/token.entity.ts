import Big from 'big.js';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { ColumnNumericTransformer } from '../../../transformer/column-numeric.transformer';

import { OperationType } from './operation-type.entity';
import { RankingType } from './ranking-type.entity';

@Entity('Token')
export class Token {
  @PrimaryColumn()
  name: string;

  @Column()
  owner: string;

  @Column('decimal', {
    precision: 6,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  rate: Big;

  @Column()
  checkingIp: boolean;

  @Column({ default: RankingType.none })
  rankingType: RankingType;

  @Column({ default: OperationType.none })
  operationType: OperationType;

  @Column({ default: '' })
  operator: string;
}
