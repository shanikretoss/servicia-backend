import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProviderDto } from './create-provider.dto';
import { ProviderDto } from './provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProviderDto[]> {
    return this.prisma.provider.findMany();
  }

  async findOne(id: string): Promise<ProviderDto | null> {
    return this.prisma.provider.findUnique({ where: { id } });
  }

  async create(input: CreateProviderDto): Promise<ProviderDto> {
    return this.prisma.provider.create({ data: input });
  }
}
