import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a user by their unique ID with optional company filtering
   */
  async findById(id: string, companyId?: string): Promise<User | null> {
    if (!companyId) {
      return this.prisma.user.findUnique({
        where: { id },
      });
    }
    return this.prisma.user.findFirst({
      where: {
        id,
        memberships: {
          some: { companyId },
        },
      },
    });
  }

  /**
   * Find a user by their unique email address
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Create a new user in the database
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * Update an existing user's data
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Find all users in the database with optional company filtering
   */
  async findAll(companyId?: string): Promise<User[]> {
    if (!companyId) {
      return this.prisma.user.findMany();
    }
    return this.prisma.user.findMany({
      where: {
        memberships: {
          some: { companyId },
        },
      },
    });
  }
}
