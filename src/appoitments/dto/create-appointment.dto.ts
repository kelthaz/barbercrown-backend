import { IsDateString, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '2025-07-21T00:00:00.000Z',
    description: 'Fecha de agendamiento de cita.',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: 'Peluquería',
    description: 'Tipo de servicio solicitado.',
  })
  @IsString()
  service: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del barbero solicitado.',
  })
  @IsString()
  barberName: string;

  @ApiProperty({
    example: 'Pendiente',
    description: 'Estado de la cita (Pendiente, Confirmada, Cancelada).',
  })
  @IsString()
  status: string;

  @ApiProperty({
    example: '11:00',
    description: 'Hora de agendamiento de la cita.',
  })
  @IsString()
  time: string;

  @ApiProperty({
    example: 1,
    description: 'ID del usuario que solicita la cita.',
  })
  @IsInt()
  userId: number;
}
