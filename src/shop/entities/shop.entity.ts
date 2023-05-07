import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shop')
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  shopName: string;
  @Column()
  owner: string;
  @Column('jsonb', { default: [] })
  member: string[];
  @Column({ default: 0 })
  amount: number;
  @Column({ default: 0 })
  lastAmount: number;
  @Column('jsonb', { default: {} })
  autoSendAddress: { [index: string]: number }[];
  @Column({ default: 0 })
  autoSendToBeLeft: number;
}
