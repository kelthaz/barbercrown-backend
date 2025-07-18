import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
    @ApiProperty({ example: 'usuario@email.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '123456' })

  @IsString()
  password: string;
}
