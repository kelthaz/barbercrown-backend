// src/appointments/appointments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  create(data: CreateAppointmentDto) {
    const appointment = this.appointmentRepo.create(data);
    return this.appointmentRepo.save(appointment);
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
