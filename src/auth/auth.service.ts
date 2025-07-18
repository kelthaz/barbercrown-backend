import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
  private jwtService: JwtService,
  @Inject(UsersService) private readonly usersService: UsersService,
  @InjectRepository(User)
  private userRepository: Repository<User>,
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
    throw new UnauthorizedException('Correo o contraseña incorrectos');
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

  async register(userData: Partial<User>) {
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Missing required fields: name, email or password');
    }

    const user = new User();
    user.email = userData.email;
    user.name = userData.name;
    user.password = await bcrypt.hash(userData.password, 10);

    return this.userRepository.save(user);
  }
}
