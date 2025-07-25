import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  service: string;

  @Column()
  barberName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  time: string;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
