import { Injectable } from '@nestjs/common';
import { RolesRepository } from './repositories/roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { Role } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async findAll(): Promise<RoleDto[]> {
    return this.rolesRepository.findAll();
  }

  async findOne(id: string): Promise<RoleDto | null> {
    return this.rolesRepository.findById(id);
  }

  async findBySlug(slug: string): Promise<Role | null> {
    return this.rolesRepository.findBySlug(slug);
  }

  async findWithPermissions(id: string): Promise<Role & { rolePermissions: { permission: { module: string; action: string } }[] } | null> {
    return this.rolesRepository.findWithPermissions(id);
  }

  async create(input: CreateRoleDto): Promise<RoleDto> {
    return this.rolesRepository.create(input);
  }
}
