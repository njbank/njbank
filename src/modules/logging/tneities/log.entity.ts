import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
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
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault('Asia/Tokyo');
    this.date = dayjs(new Date()).format('YYYY-MM-DD hh:mm:ss.SSSZ');
    this.bankType = bankType;
    this.bankId = bankId;
    this.logType = logType;
    this.logText = logText;
    this.reason = reason;
  }
  @PrimaryGeneratedColumn()
  id?: number;
  @Column('timestamp with time zone', {
    default: '2000-01-01 00:00:00.000+09:00',
  })
  date: string;
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
