import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Pelicula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  director: string;

  @Column()
  year: number;

  @Column()
  length_minutes: number;
}
