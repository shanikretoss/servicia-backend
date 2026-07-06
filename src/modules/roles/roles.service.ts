import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRoleDto } from './create-role.dto';
import { RoleDto } from './role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<RoleDto[]> {
    return this.prisma.role.findMany();
  }

  async findOne(id: string): Promise<RoleDto | null> {
    return this.prisma.role.findUnique({ where: { id } });
  }

  async create(input: CreateRoleDto): Promise<RoleDto> {
    return this.prisma.role.create({ data: input });
  }
}
