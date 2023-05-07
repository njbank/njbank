import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RankingEntries {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: string;
  @Column()
  userName: string;
  @Index()
  @Column()
  board: number;
  @Column()
  amount: number;
}
