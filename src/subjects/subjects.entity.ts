import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Schedules } from "./schedules.entity";
import { Professors } from "./professors.entity";

@Entity()
export class Subjects {
  @PrimaryGeneratedColumn({})
  idsubject: number;

  @Column("varchar", { length: 45 })
  code: string;

  @Column("varchar", { length: 45 })
  classcode: string;

  @Column("varchar", { length: 200 })
  name: string;

  @Column("int")
  totalvacancies: number;

  @Column("int")
  freevacancies: number;

  @OneToMany(type => Schedules, schedules => schedules.subject, {
    cascade: true,
    onDelete: "CASCADE"
  })
  schedules: Schedules[];

  @ManyToMany(() => Professors, {
    cascade: true,
  })
  @JoinTable()
  professors: Professors[];
}