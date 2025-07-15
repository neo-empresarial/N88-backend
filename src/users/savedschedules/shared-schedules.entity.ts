import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Users } from '../user.entity';
import { SavedSchedules } from './savedschedules.entity';
import { Group } from '../../groups/groups.entity';

@Entity()
export class SharedSchedules {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SavedSchedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'scheduleId', referencedColumnName: 'idsavedschedule' })
  originalSchedule: SavedSchedules;

  @Column('int')
  scheduleId: number;

  @ManyToOne(() => Users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sharedByUserId', referencedColumnName: 'iduser' })
  sharedByUser: Users;

  @Column('int')
  sharedByUserId: number;

  @ManyToOne(() => Users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sharedWithUserId', referencedColumnName: 'iduser' })
  sharedWithUser: Users;

  @Column('int')
  sharedWithUserId: number;

  @ManyToOne(() => Group, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'groupId', referencedColumnName: 'id' })
  group: Group;

  @Column('int')
  groupId: number;

  @CreateDateColumn()
  sharedAt: Date;

  @Column('boolean', { default: false })
  isAccepted: boolean;

  @Column('timestamp', { nullable: true })
  acceptedAt: Date;
}
