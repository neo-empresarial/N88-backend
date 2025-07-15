import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../user.entity';
import { SavedScheduleItems } from './savedscheduleitems.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class SavedSchedules {
  @PrimaryGeneratedColumn()
  idsavedschedule: number;

  @Column('varchar', { length: 45 })
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Users, (user) => user.savedschedules, {
    onDelete: 'CASCADE',
  })
  user: Users;

  @OneToMany(() => SavedScheduleItems, (items) => items.savedSchedule, {
    cascade: true,
  })
  @Exclude()
  items: SavedScheduleItems[];
}
