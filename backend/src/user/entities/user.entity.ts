import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: 'cliente' | 'profissional';

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  specialty?: string;

  @Column({ nullable: true })
  phone?: string; 

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  consultationPrice?: number;

  @Column({ nullable: true })
  photo?: string; 
}
