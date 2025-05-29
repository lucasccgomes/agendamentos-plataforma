import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  professional: User;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column({ default: true })
  available: boolean;
}
