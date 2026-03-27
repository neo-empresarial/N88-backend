import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../user.entity';
import { SavedScheduleItems } from './savedscheduleitems.entity';
import { Semesters } from 'src/semesters/semesters.entity';
import { Campus } from 'src/campus/campus.entity';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';

@Entity()
export class SavedSchedules {
  @PrimaryGeneratedColumn()
  idsavedschedule: number;

  @Column('varchar', { length: 50 })
  @IsNotEmpty({ message: 'O título não pode ser vazio.' })
  @MaxLength(50, { message: 'O título deve ter no máximo 50 caracteres.' })
  title: string;

  @Column({ nullable: true, default: '' })
  description: string;

  @Column({ default: 0 })
  totalCredits: number;

  @ManyToOne(() => Users, (user) => user.savedschedules, {
    onDelete: 'CASCADE',
  })
  user: Users;

  @ManyToOne(() => Semesters, { nullable: true, onDelete: 'SET NULL' })
  semester: Semesters;

  @ManyToOne(() => Campus, (campus) => campus.savedSchedules, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campus_id' })
  campus: Campus;

  @OneToMany(() => SavedScheduleItems, (items) => items.savedSchedule, {
    cascade: true,
  })
  @Exclude()
  items: SavedScheduleItems[];
}
