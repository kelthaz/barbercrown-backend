import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { User } from '../users/users.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateAppointmentDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: data.userId });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const appointment = this.appointmentRepo.create({
        date: data.date,
        service: data.service,
        barberName: data.barberName,
        status: data.status,
        user: user,
      });

      await this.appointmentRepo.save(appointment);

      return this.appointmentRepo.findOne({
        where: { id: appointment.id },
        relations: ['user'],
      });
    } catch (error) {
      console.error('Error al crear la cita:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error interno al crear la cita');
    }
  }

  findAll() {
    return this.appointmentRepo.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.appointmentRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async update(id: number, data: Partial<Appointment>) {
    await this.appointmentRepo.update(id, data);
    return this.findOne(id);
  }

  delete(id: number) {
    return this.appointmentRepo.delete(id);
  }
}
