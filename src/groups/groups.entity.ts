import { Users } from '../users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('int')
  createdBy: number; // Reference to the user who created the group

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Many-to-many relationship with Users
  @ManyToMany(() => Users)
  @JoinTable({
    name: 'group_members', // Junction table name
    joinColumn: {
      name: 'groupId',
      referencedColumnName:'id',  // References Group.id
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'iduser', // References Users.iduser (your actual PK)
    },
  })
  members: Users[];
}