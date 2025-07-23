import { Controller, Get} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
        private readonly rolesService: RolesService,
  ) {}

  @ApiOperation({ summary: 'Obtener todos los roles.' })
  @ApiResponse({ status: 200, description: 'Lista de roles.' })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
