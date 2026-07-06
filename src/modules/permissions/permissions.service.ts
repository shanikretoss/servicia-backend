import { Injectable } from '@nestjs/common';
import { PermissionsRepository } from './repositories/permissions.repository';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionDto } from './dto/permission.dto';
import { Permission } from '@prisma/client';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async findAll(): Promise<PermissionDto[]> {
    return this.permissionsRepository.findAll();
  }

  async findOne(id: string): Promise<PermissionDto | null> {
    return this.permissionsRepository.findById(id);
  }

  async findByModuleAction(module: string, action: string): Promise<Permission | null> {
    return this.permissionsRepository.findByModuleAction(module, action);
  }

  async create(input: CreatePermissionDto): Promise<PermissionDto> {
    return this.permissionsRepository.create(input);
  }
}
