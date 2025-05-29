import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  client: User;

  @ManyToOne(() => Schedule)
  schedule: Schedule;

  @Column()
  status: string;
}
