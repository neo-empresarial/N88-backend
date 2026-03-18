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

@Entity()
@Index('UQ_subjects_code_semester', ['code', 'semester'], { unique: true })
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
  pedidos_sem_vaga: number;
}
