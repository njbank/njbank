import { Column, Entity, PrimaryColumn } from 'typeorm';

import { RankingType } from './ranking-type.entity';

@Entity('Token')
export class Token {
  @PrimaryColumn()
  name: string;

  @Column()
  owner: string;

  @Column('decimal', { precision: 6, scale: 2 })
  rate: number;

  @Column()
  checkingIp: boolean;

  @Column({ default: RankingType.none })
  rankingType: RankingType;
}
