import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Log {
  constructor(
    bankType: string,
    bankId: string,
    logType: string,
    logText: string,
    reason: string,
  ) {
    this.bankType = bankType;
    this.bankId = bankId;
    this.logType = logType;
    this.logText = logText;
    this.reason = reason;
  }
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  bankType: string;
  @Column()
  bankId: string;
  @Column()
  logType: string;
  @Column()
  logText: string;
  @Column()
  reason: string;
}
