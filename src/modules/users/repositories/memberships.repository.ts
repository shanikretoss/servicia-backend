import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Membership, Prisma } from '@prisma/client';

@Injectable()
export class MembershipsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a membership by its ID
   */
  async findById(id: string): Promise<Membership | null> {
    return this.prisma.membership.findUnique({
      where: { id },
    });
  }

  /**
   * Find all memberships of a user
   */
  async findByUserId(userId: string): Promise<Membership[]> {
    return this.prisma.membership.findMany({
      where: { userId },
    });
  }

  /**
   * Find a specific user membership within a company
   */
  async findByUserAndCompany(userId: string, companyId: string): Promise<Membership | null> {
    return this.prisma.membership.findFirst({
      where: { userId, companyId },
    });
  }

  /**
   * Create a new membership
   */
  async create(data: Prisma.MembershipUncheckedCreateInput): Promise<Membership> {
    return this.prisma.membership.create({
      data,
    });
  }

  /**
   * Update an existing membership
   */
  async update(id: string, data: Prisma.MembershipUpdateInput): Promise<Membership> {
    return this.prisma.membership.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a membership
   */
  async delete(id: string): Promise<Membership> {
    return this.prisma.membership.delete({
      where: { id },
    });
  }
}

export { MembershipsRepository as MembershipRepository };
