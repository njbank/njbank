import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('skin')
export class Skin {
  @PrimaryColumn()
  @Index()
  id: string;
  @Column()
  url: string;
}
