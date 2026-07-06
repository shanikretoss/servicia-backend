import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Role, Prisma } from '@prisma/client';

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a role by its unique ID
   */
  async findById(id: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  /**
   * Find all roles
   */
  async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  /**
   * Create a new role
   */
  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    return this.prisma.role.create({
      data,
    });
  }
}

export { RolesRepository as RoleRepository };
