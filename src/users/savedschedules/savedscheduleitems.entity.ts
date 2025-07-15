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

  @ManyToOne(() => SavedSchedules, (savedSchedule) => savedSchedule.items, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  savedSchedule: SavedSchedules;
}
