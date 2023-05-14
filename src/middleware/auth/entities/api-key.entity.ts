import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ApiKey {
  @PrimaryColumn()
  key: string;
  @Column()
  owner: string;
  @Column('jsonb', { default: [] })
  permissions: string[];
  @Column('jsonb', { default: {} })
  paramsWhiteList: { [index: string]: string[] };
  @Column('jsonb', { default: [] })
  ipCheckExcludes: string[];
}
