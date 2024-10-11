import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Professors {
  @PrimaryGeneratedColumn()
  idprofessor: number;

  @Column("varchar", { length: 150 })
  name: string;
}