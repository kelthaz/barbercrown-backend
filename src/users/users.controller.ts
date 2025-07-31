import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Crear nuevo usuario.' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener todos los usuarios.' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener todos los barberos.' })
  @ApiResponse({ status: 200, description: 'Lista de barberos.' })
  @Get('barbers')
  getActiveBarbers() {
    return this.usersService.getActiveBarbers();
  }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.usersService.findOne(+id);
  //   }

  @ApiOperation({ summary: 'Actualizar un usuario.' })
  @ApiResponse({ status: 201, description: 'Usuario actualizado correctamente.' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
