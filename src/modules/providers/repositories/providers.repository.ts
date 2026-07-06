import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Provider, Prisma } from '@prisma/client';

@Injectable()
export class ProvidersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a provider by its unique ID with optional company filtering
   */
  async findById(id: string, companyId?: string): Promise<Provider | null> {
    if (!companyId) {
      return this.prisma.provider.findUnique({
        where: { id },
      });
    }
    return this.prisma.provider.findFirst({
      where: {
        id,
        connectedAccounts: {
          some: { companyId },
        },
      },
    });
  }

  /**
   * Find all providers with optional company filtering
   */
  async findAll(companyId?: string): Promise<Provider[]> {
    if (!companyId) {
      return this.prisma.provider.findMany();
    }
    return this.prisma.provider.findMany({
      where: {
        connectedAccounts: {
          some: { companyId },
        },
      },
    });
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
