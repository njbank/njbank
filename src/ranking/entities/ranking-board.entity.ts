import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RankingBoard {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  tag: string;
  @Index()
  @Column()
  token: string;
  @Column('tstzrange')
  date: string;
}
