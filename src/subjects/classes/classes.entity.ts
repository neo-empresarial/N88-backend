import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Schedules } from "../schedules/schedules.entity";
import { Professors } from "../professors/professors.entity";
import { Subjects } from "../subjects.entity";

@Entity()
export class Classes {
  @PrimaryGeneratedColumn({})
  idclass: number;

  @Column("varchar", { length: 45 })
  classcode: string;

  @Column("int")
  totalvacancies: number;

  @Column("int")
  freevacancies: number;

  @OneToMany(type => Schedules, schedules => schedules.classes, {
    cascade: true,
    onDelete: "CASCADE"
  })
  schedules: Schedules[];

  @ManyToMany(() => Professors, {
    cascade: true,
  })
  @JoinTable()
  professors: Professors[];

  @ManyToOne(type => Subjects, subject => subject.classes)
  subject: Subjects;

}