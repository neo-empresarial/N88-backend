import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SavedSchedules } from './savedschedules.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class SavedScheduleItems {
  @PrimaryGeneratedColumn()
  idsavedscheduleitem: number;

  @Column('varchar', { length: 45 })
  subjectCode: string;

  @Column('varchar', { length: 45 })
  classCode: string;

  @Column('boolean', { default: true })
  activated: boolean;

  @Column('int', { default: 1 })
  planNumber: number;

  @Column('int', { default: 0 })
  credits: number;

  @ManyToOne(() => SavedSchedules, (savedSchedule) => savedSchedule.items, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  savedSchedule: SavedSchedules;
}
