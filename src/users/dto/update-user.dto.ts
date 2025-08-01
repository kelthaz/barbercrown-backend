import {
  IsString,
  IsEmail,
  MinLength,
  IsNumber,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '32145789651', description: 'Telefono del usuario' })
  @IsString()
  @MinLength(10)
  phone: string;

  @ApiProperty({ example: '1', description: 'Estado del usuario.' })
  @IsNumber()
  estado: number;

  @ApiProperty({ example: '1', description: 'Rol_id del usuario' })
  @IsNumber()
  rol_id: number;

  @ApiProperty({ example: '1', description: 'Rol_id del usuario' })
  @IsObject()
  rol: object;
}
