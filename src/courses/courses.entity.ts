import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "src/users/user.entity";

@Entity()
export class Courses {
  @PrimaryGeneratedColumn({})
  idcourse: number;

  @Column("varchar", { length: 100, nullable: false }) 
  course: string;
}