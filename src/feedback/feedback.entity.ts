import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Feedback{
  @PrimaryGeneratedColumn({})
  idfeedback: number;

  @Column("varchar", { length: 500 })
  message: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date: Date;
}