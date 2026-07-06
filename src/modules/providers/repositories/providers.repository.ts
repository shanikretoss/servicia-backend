import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Provider, Prisma } from '@prisma/client';

@Injectable()
export class ProvidersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a provider by its unique ID
   */
  async findById(id: string): Promise<Provider | null> {
    return this.prisma.provider.findUnique({
      where: { id },
    });
  }

  /**
   * Find all providers
   */
  async findAll(): Promise<Provider[]> {
    return this.prisma.provider.findMany();
  }

  /**
   * Create a new provider
   */
  async create(data: Prisma.ProviderCreateInput): Promise<Provider> {
    return this.prisma.provider.create({
      data,
    });
  }
}
