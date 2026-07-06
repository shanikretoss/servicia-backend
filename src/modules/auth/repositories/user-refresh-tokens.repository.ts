import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { UserRefreshToken, Prisma } from '@prisma/client';

@Injectable()
export class UserRefreshTokensRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new refresh token record in the database
   */
  async create(data: Prisma.UserRefreshTokenUncheckedCreateInput): Promise<UserRefreshToken> {
    return this.prisma.userRefreshToken.create({
      data,
    });
  }

  /**
   * Find a refresh token record by its token hash
   */
  async findByTokenHash(tokenHash: string): Promise<UserRefreshToken | null> {
    return this.prisma.userRefreshToken.findFirst({
      where: { tokenHash },
    });
  }

  /**
   * Revoke a specific refresh token by updating its revokedAt timestamp
   */
  async revoke(id: string): Promise<UserRefreshToken> {
    return this.prisma.userRefreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Revoke all refresh tokens for a specific user
   */
  async revokeAllForUser(userId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.userRefreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Delete all refresh tokens for a specific user
   */
  async deleteAllForUser(userId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.userRefreshToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * Update the lastUsedAt timestamp of a refresh token
   */
  async updateLastUsed(id: string): Promise<UserRefreshToken> {
    return this.prisma.userRefreshToken.update({
      where: { id },
      data: { lastUsedAt: new Date() },
    });
  }
}
