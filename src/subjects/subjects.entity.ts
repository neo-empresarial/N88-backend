import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classes } from './classes/classes.entity';
import { SavedSchedules } from 'src/users/savedschedules/savedschedules.entity';
import { Semesters } from 'src/semesters/semesters.entity';
import { Campus } from 'src/campus/campus.entity';

@Entity()
@Index('UQ_subjects_code_semester_campus', ['code', 'semester', 'campus'], {
  unique: true,
})
export class Subjects {
  @PrimaryGeneratedColumn({})
  idsubject: number;

  @Column('varchar', { length: 45 })
  code: string;

  @Column('varchar', { length: 200 })
  name: string;

  @ManyToOne(() => Semesters, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'semester_id' })
  semester: Semesters;

  @ManyToOne(() => Campus, (campus) => campus.subjects, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campus_id' })
  campus: Campus;

  @OneToMany((type) => Classes, (classes) => classes.subject, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  classes: Classes[];

  @ManyToMany(() => SavedSchedules, {
    onDelete: 'NO ACTION',
  })
  @JoinTable()
  savedschedules: SavedSchedules[];

  @Column('int')
  orders_without_vacancy: number;
}
