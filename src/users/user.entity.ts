import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SavedSchedules } from './savedschedules/savedschedules.entity';
import { Courses } from '../courses/courses.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  iduser: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 55, unique: true })
  email: string;

  @Column('varchar', { length: 255, nullable: true })
  password: string;

  @Column('varchar', { length: 20, nullable: true })
  provider: string;

  @ManyToOne(() => Courses)
  @JoinColumn({ name: 'courseId' })
  course: Courses;

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
