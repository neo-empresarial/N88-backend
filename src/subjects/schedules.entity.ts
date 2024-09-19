import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Subjects } from "./subjects.entity";

@Entity()
export class Schedules {
  @PrimaryGeneratedColumn()
  idschedule: number;

  @Column("varchar", { length: 45 })
  weekday: string;

  @Column("varchar", { length: 45 })
  starttime: string;

  @Column("int")
  classesnumber: number;

  @Column("varchar", { length: 45 })
  building: string;

  @Column("varchar", { length: 45 })
  room: string;

  @ManyToOne(type => Subjects, subject => subject.schedules)
  subject: Subjects;
}