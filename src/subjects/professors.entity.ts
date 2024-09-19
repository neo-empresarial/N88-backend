import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Professors {
  @PrimaryGeneratedColumn()
  idprofessor: number;

  @Column("varchar", { length: 45 })
  name: string;
}