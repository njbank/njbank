import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryColumn()
  id: string;
  @Column('jsonb')
  allowedPaths: string[];
  @Column('jsonb', { default: [] })
  placeHolder: string[];
}
