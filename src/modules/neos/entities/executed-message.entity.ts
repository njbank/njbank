import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExecutedMessage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  msgId: string;
}
