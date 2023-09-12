import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Skin {
  @PrimaryColumn()
  @Index()
  id: string;
  @Column()
  url: string;
}
