// src/appointments/dto/create-appointment.dto.ts
import { IsDateString, IsString, IsInt } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  date: string;

  @IsString()
  service: string;

  @IsString()
  barberName: string;

  @IsInt()
  userId: number;
}
