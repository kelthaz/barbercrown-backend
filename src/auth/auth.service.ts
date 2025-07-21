import {
  Injectable,
  UnauthorizedException,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Role } from '../roles/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(UsersService) private readonly usersService: UsersService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect(['user.password'])
      .leftJoinAndSelect('user.rol', 'rol')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password[0]);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(dto: LoginAuthDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = { sub: user.id, email: user.email, role: user.rol?.name };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.rol?.name,
      },
    };
  }

  async registerUser(createUserDto: CreateUserDto) {
    const { rol_id, password, ...userData } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

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

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw error;
    }
  }
}
