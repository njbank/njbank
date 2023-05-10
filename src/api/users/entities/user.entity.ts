import { Column, Entity, PrimaryColumn } from 'typeorm';

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
  @Column('decimal', { default: 0 })
  amount: number;
  @Column('jsonb', { default: {} })
  tokens: { [index: string]: number }[];
  @Column({ default: '' })
  oneTimeCode: string;
  @Column('jsonb', { default: ['NONE'] })
  skin: string[];
}
