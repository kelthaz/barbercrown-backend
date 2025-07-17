import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo usuario.' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente.' })
  create(@Body() userData: Partial<User>) {
    return this.usersService.create(userData);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios.' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos con exito.' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.usersService.findOne(+id);
//   }

//   @Put(':id')
//   update(@Param('id') id: string, @Body() userData: Partial<User>) {
//     return this.usersService.update(+id, userData);
//   }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
