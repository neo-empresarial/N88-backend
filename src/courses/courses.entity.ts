import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Courses {
  @PrimaryGeneratedColumn({})
  idcourse: number;

  @Column("varchar", { length: 100, unique: true })
  course: string;
}