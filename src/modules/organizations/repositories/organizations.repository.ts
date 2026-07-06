import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Organization, Prisma } from '@prisma/client';

@Injectable()
export class OrganizationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find an organization by its unique ID
   */
  async findById(id: string): Promise<Organization | null> {
    return this.prisma.organization.findUnique({
      where: { id },
    });
  }

  /**
   * Find an organization by its unique slug
   */
  async findBySlug(slug: string): Promise<Organization | null> {
    return this.prisma.organization.findUnique({
      where: { slug },
    });
  }

  /**
   * Find an organization by its name
   */
  async findByName(name: string): Promise<Organization | null> {
    return this.prisma.organization.findFirst({
      where: { name },
    });
  }

  /**
   * Find all organizations
   */
  async findAll(): Promise<Organization[]> {
    return this.prisma.organization.findMany();
  }

  /**
   * Create a new organization
   */
  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    return this.prisma.organization.create({
      data,
    });
  }

  /**
   * Update an existing organization
   */
  async update(id: string, data: Prisma.OrganizationUpdateInput): Promise<Organization> {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete an organization
   */
  async delete(id: string): Promise<Organization> {
    return this.prisma.organization.delete({
      where: { id },
    });
  }
}

export { OrganizationsRepository as OrganizationRepository };
