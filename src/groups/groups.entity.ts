import { Users } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('int')
  createdBy: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'iduser' })
  owner: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToMany(() => Users)
  @JoinTable({
    name: 'group_members',
    joinColumn: {
      name: 'groupId',
      referencedColumnName: 'id', 
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'iduser',
    },
  })
  members: Users[];
}
