import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  expiryDate: Date;

  @Column()
  token: string;
}
