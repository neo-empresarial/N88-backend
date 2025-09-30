import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SavedSchedules } from './savedschedules/savedschedules.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  iduser: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 55, unique: true })
  email: string;

  @Column('varchar', { length: 20 })
  provider: string;

  @Column('varchar', { length: 255, nullable: true }) // Nullable for Google users
  password: string;

  @Column('varchar', { length: 45 })
  course: string;
  idcourse: number;

  @OneToMany(
    (type) => SavedSchedules,
    (savedschedules) => savedschedules.user,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  savedschedules: SavedSchedules[];
}
