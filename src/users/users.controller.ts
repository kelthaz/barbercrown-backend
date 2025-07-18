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
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './users.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../roles/role.entity';
import * as bcrypt from 'bcrypt';


@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // aquí está roleRepository

    private readonly usersService: UsersService,
  ) {}

@Post()
@ApiOperation({ summary: 'Crear nuevo usuario.' })
@ApiResponse({ status: 201, description: 'Usuario creado correctamente.' })
async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  const { rol_id, password, ...userData } = createUserDto;

  const role = await this.roleRepository.findOne({ where: { id: rol_id } });
  if (!role) {
    throw new NotFoundException(`El rol con ID ${rol_id} no existe`);
  }

  if (!password) {
    throw new BadRequestException('La contraseña es requerida');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = this.userRepository.create({
    ...userData,
    password: hashedPassword,
    rol: role,
  });

  return this.userRepository.save(newUser);
}


  @ApiOperation({ summary: 'Obtener todos los usuarios.' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
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
