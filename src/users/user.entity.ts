import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SavedSchedules } from './savedschedules/savedschedules.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  iduser: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 55, unique: true })
  email: string;

  @Column('varchar', { length: 255, nullable: true }) // Nullable for Google users
  password: string;

  @Column('varchar', { length: 45 })
  course: string;

  // // How you got to know about the platform
  // @Column("varchar", { length: 45 })
  // source: string;

  // // Last access to the platform
  // @Column("datetime")
  // lastaccess: Date;

  // Field to identify whether the user is using local authentication or Google OAuth
  @Column('varchar', { length: 10, nullable: false, default: 'local' }) // 'local' or 'google'
  authType: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  googleAccessToken: string; // Storing Google access token for Google users

  @OneToMany(
    (type) => SavedSchedules,
    (savedschedules) => savedschedules.user,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  savedschedules: SavedSchedules[];
}
