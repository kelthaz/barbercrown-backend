// src/appointments/appointments.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('Citas')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({ summary: 'Crear una cita.' })
  @ApiResponse({ status: 201, description: 'Cita creada correctamente.' })
  @Post()
  create(@Body() data: CreateAppointmentDto) {
    return this.appointmentsService.create(data);
  }

  @ApiOperation({ summary: 'Obtener todas las citas creadas.' })
  @ApiResponse({ status: 201, description: 'Citas obtenidas correctamente.' })
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una cita por ID.' })
  @ApiResponse({ status: 201, description: 'Cita obtenida correctamente.' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.appointmentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una cita.' })
  @ApiResponse({ status: 201, description: 'Cita actualizada correctamente.' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.appointmentsService.delete(id);
  }
}
