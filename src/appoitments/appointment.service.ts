import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { User } from '../users/users.entity';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

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
        time: data.time,
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

  async update(id: number, data: UpdateAppointmentDto) {
    const user = await this.userRepository.findOneBy({ id: data.userId });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException(`La cita con ID ${id} no existe`);
    }

    const updatedData: Partial<Appointment> = {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    };

    await this.appointmentRepo.update(id, updatedData);
    return this.findOne(id);
  }

  delete(id: number) {
    return this.appointmentRepo.delete(id);
  }

  async getAvailableSlots(barberName: string, date: string) {
    const WORKING_HOURS = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ];

    const parsedDate = new Date(date.replace(' ', 'T'));
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Fecha inválida recibida');
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await this.appointmentRepo.find({
      where: {
        barberName,
        date: Between(startOfDay, endOfDay),
        status: 'active',
      },
    });

    const bookedTimes = appointments.map((appt) => appt.time);

    const availableTimes = WORKING_HOURS.filter(
      (hour) => !bookedTimes.includes(hour),
    );

    return availableTimes;
  }
}
