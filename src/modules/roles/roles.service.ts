import { Injectable } from '@nestjs/common';
import { RolesRepository } from './repositories/roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async findAll(): Promise<RoleDto[]> {
    return this.rolesRepository.findAll();
  }

  async findOne(id: string): Promise<RoleDto | null> {
    return this.rolesRepository.findById(id);
  }

  async create(input: CreateRoleDto): Promise<RoleDto> {
    return this.rolesRepository.create(input);
  }
}
