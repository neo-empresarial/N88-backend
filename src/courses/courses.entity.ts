import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Campus } from 'src/campus/campus.entity';

@Entity()
export class Courses {
  @PrimaryGeneratedColumn({})
  idcourse: number;

  @Column('varchar', { length: 100, nullable: false })
  course: string;

  @ManyToOne(() => Campus, (campus) => campus.courses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campus_id' })
  campus: Campus;
}
