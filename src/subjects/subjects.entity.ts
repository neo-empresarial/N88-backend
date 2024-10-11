import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Classes } from "./classes/classes.entity";
import { Users } from "../users/user.entity";

@Entity()
export class Subjects {
  @PrimaryGeneratedColumn({})
  idsubject: number;

  @Column("varchar", { length: 45, unique: true })
  code: string;

  @Column("varchar", { length: 200 })
  name: string;

  @OneToMany(type => Classes, classes => classes.subject, {
    cascade: true,
    onDelete: "CASCADE"
  })
  classes: Classes[];

  @ManyToMany(() => Users, {
    onDelete: "CASCADE"
  })
  @JoinTable()
  users: Users[];
}