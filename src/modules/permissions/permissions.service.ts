import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePermissionDto } from './create-permission.dto';
import { PermissionDto } from './permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PermissionDto[]> {
    return this.prisma.permission.findMany();
  }

  async findOne(id: string): Promise<PermissionDto | null> {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  async create(input: CreatePermissionDto): Promise<PermissionDto> {
    return this.prisma.permission.create({ data: input });
  }
}
