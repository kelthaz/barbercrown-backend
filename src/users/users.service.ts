import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Role } from '../roles/roles.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { rol_id, password, ...userData } = createUserDto;

      if (!password) {
        throw new BadRequestException('La contraseña es requerida');
      }

      const role = await this.roleRepository.findOne({ where: { id: rol_id } });

      if (!role) {
        throw new NotFoundException(`El rol con ID ${rol_id} no existe`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
        rol: role,
      });
      console.log('Usuario creado con exito:', user.name);
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error creando usuario:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocurrió un error al crear el usuario',
      );
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'phone'], // 👈 agrega password aquí
      relations: ['rol'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, data: UpdateUserDto) {
    try {
      const { password, ...userData } = data;
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      Object.assign(user, userData);

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocurrió un error al actualizar el usuario',
      );
    }
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getActiveBarbers(): Promise<User[]> {
    return this.userRepository.find({
      where: {
        estado: 1,
        rol: {
          name: 'Barbero',
        },
      },
      relations: ['rol'],
    });
  }
}
