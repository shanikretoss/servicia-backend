import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a company by its unique ID
   */
  async findById(id: string): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id },
    });
  }

  /**
   * Find all companies
   */
  async findAll(): Promise<Company[]> {
    return this.prisma.company.findMany();
  }

  /**
   * Find all companies belonging to a specific organization
   */
  async findByOrganizationId(organizationId: string): Promise<Company[]> {
    return this.prisma.company.findMany({
      where: { organizationId },
    });
  }

  /**
   * Create a new company
   */
  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({
      data,
    });
  }
}
