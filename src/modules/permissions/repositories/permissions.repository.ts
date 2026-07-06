import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Permission, Prisma } from '@prisma/client';

@Injectable()
export class PermissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a permission by its unique ID
   */
  async findById(id: string): Promise<Permission | null> {
    return this.prisma.permission.findUnique({
      where: { id },
    });
  }

  /**
   * Find all permissions
   */
  async findAll(): Promise<Permission[]> {
    return this.prisma.permission.findMany();
  }

  /**
   * Find a permission by module and action
   */
  async findByModuleAction(module: string, action: string): Promise<Permission | null> {
    return this.prisma.permission.findUnique({
      where: { module_action: { module, action } },
    });
  }

  /**
   * Create a new permission
   */
  async create(data: Prisma.PermissionCreateInput): Promise<Permission> {
    return this.prisma.permission.create({
      data,
    });
  }
}

export { PermissionsRepository as PermissionRepository };
