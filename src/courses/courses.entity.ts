import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Courses {
  @PrimaryGeneratedColumn({})
  idcourse: number;

  @Column("varchar", { length: 100, nullable: false }) 
  course: string;
}