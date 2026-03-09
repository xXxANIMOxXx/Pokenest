import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Monstruo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  species: string;

  @Column()
  element: string;

  @Column()
  weakness: string;
}
