import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/user.entity';
import { Group } from '../groups/groups.entity';

export enum NotificationType {
  GROUP_INVITATION = 'GROUP_INVITATION',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.GROUP_INVITATION,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @ManyToOne(() => Users)
  sender: Users;

  @ManyToOne(() => Users)
  recipient: Users;

  @ManyToOne(() => Group, { 
    onDelete: 'CASCADE',
    nullable: true,
  })
  group: Group;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
