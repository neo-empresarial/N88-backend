import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subjects } from 'src/subjects/subjects.entity';
import { Courses } from 'src/courses/courses.entity';
import { SavedSchedules } from 'src/users/savedschedules/savedschedules.entity';

@Entity()
export class Campus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100, unique: true, nullable: false })
  name: string;

  @OneToMany(() => Subjects, (subject) => subject.campus)
  subjects: Subjects[];

  @OneToMany(() => Courses, (course) => course.campus)
  courses: Courses[];

  @OneToMany(() => SavedSchedules, (schedule) => schedule.campus)
  savedSchedules: SavedSchedules[];
}
