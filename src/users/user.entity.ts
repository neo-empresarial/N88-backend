import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SavedSchedules } from "./savedschedules/savedschedules.entity";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  iduser: number;

  @Column("varchar", { length: 100 })
  name: string;

  @Column("varchar", { length: 55 })
  email: string;

  @Column("varchar", { length: 255 })
  password: string;

  @Column("varchar", { length: 45 })
  course: string;

  // // How you got to know about the platform
  // @Column("varchar", { length: 45 })
  // source: string;

  // // Last access to the platform
  // @Column("datetime")
  // lastaccess: Date;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(type => SavedSchedules, savedschedules => savedschedules.user, {
    cascade: true,
    onDelete: "CASCADE"
  })
  savedschedules: SavedSchedules[];
}