import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './auth.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login a la aplicacion.' })
  @ApiResponse({ status: 201, description: 'Login exitoso.' })
  @ApiBody({ type: LoginAuthDto })
  @Post('login')
  async login(@Body() body, @Body() loginData: LoginAuthDto) {
    try {
      const user = await this.authService.validateUser(
        loginData.email,
        loginData.password,
      );

      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      return this.authService.login(user);
    } catch (error) {
      console.error('Login error:', error);

      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  @ApiOperation({ summary: 'Registrar un usuario nuevo.' })
  @ApiResponse({ status: 201, description: 'Registro creado con exitoso.' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }
}
