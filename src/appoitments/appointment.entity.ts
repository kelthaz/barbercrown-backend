// src/appointments/appointment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  service: string;

  @Column()
  barberName: string;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => User, (user) => user.appointments)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
