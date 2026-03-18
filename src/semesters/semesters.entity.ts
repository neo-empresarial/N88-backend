import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Semesters {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 10, unique: true })
  semester: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations will be added by Worker 2
  // @OneToMany(() => Subjects, (subject) => subject.semester)
  // subjects: Subjects[];
}
