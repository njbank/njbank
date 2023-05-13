import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity()
export class RankingEntry {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: string;
  @Index()
  @Column()
  board: number;
  @Column()
  amount: number;
  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;
}
