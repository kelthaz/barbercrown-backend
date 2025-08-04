import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Administrador',
    description: 'Nombre del rol',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
