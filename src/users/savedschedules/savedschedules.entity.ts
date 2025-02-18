import { Subjects } from "src/subjects/subjects.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../user.entity";

@Entity()
export class SavedSchedules {
  @PrimaryGeneratedColumn()
  idsavedschedule: number;

  @Column("varchar", { length: 45 })
  title: string;

  @Column("text")
  description: string;

  @ManyToOne(() => Users, user => user.savedschedules, {
    onDelete: "CASCADE"
  })
  user: Users;

  @ManyToMany(() => Subjects, {
    onDelete: "NO ACTION"
  })
  @JoinTable()
  subjects: Subjects[];
}