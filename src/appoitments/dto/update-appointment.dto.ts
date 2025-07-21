// src/appointments/dto/update-appointment.dto.ts
import { IsOptional, IsDateString, IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    example: '2025-07-21T00:00:00.000Z',
    description: 'Fecha de agendamiento de cita.',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    example: 'Peluquería',
    description: 'Tipo de servicio solicitado.',
  })
  @IsOptional()
  @IsString()
  service?: string;

  @ApiPropertyOptional({
    example: 'Juan',
    description: 'Nombre del barbero solicitado.',
  })
  @IsOptional()
  @IsString()
  barberName?: string;

  @ApiPropertyOptional({
    example: 'Pendiente',
    description: 'Estado de la cita (Pendiente, Confirmada, Cancelada).',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID del usuario que solicita la cita.',
  })
  @IsOptional()
  @IsInt()
  userId?: number;
}
