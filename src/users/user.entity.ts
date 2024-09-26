import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subjects } from "../subjects/subjects.entity";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  idsavedschedule: number;

  @Column("varchar", { length: 45, unique: true })
  code: string;

  @ManyToMany(() => Subjects, {
    onDelete: "CASCADE"
  })
  @JoinTable()
  subjects: Subjects[];
}