import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRefreshTokensRepository } from '../repositories/user-refresh-tokens.repository';
import { RefreshTokenHelper } from '../helpers/refresh-token.helper';
import { AuthErrors } from '../helpers/auth-response.helper';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly userRefreshTokensRepository: UserRefreshTokensRepository,
    private readonly refreshTokenHelper: RefreshTokenHelper,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Calculate lifespan, hash, and persist a new refresh token for a user
   */
  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedToken = this.refreshTokenHelper.hashToken(refreshToken);
    const expiresInStr = this.configService.get<string>('auth.jwt.refreshExpiresIn') || '7d';
    const expiresAt = this.refreshTokenHelper.calculateExpirationDate(expiresInStr);

    await this.userRefreshTokensRepository.create({
      userId,
      tokenHash: hashedToken,
      expiresAt,
    });
  }

  /**
   * Verify old refresh token database record and rotate it with a new one
   */
  async rotateRefreshToken(oldToken: string, newRefreshToken: string, userId: string): Promise<void> {
    const tokenHash = this.refreshTokenHelper.hashToken(oldToken);
    const storedToken = await this.userRefreshTokensRepository.findByTokenHash(tokenHash);

    // Verify token exists, belongs to the correct user, is not expired and is not revoked
    if (!storedToken || storedToken.userId !== userId || storedToken.revokedAt) {
      throw AuthErrors.invalidOrExpiredToken();
    }
    if (storedToken.expiresAt < new Date()) {
      throw AuthErrors.invalidOrExpiredToken();
    }

    // Revoke the old refresh token record
    await this.userRefreshTokensRepository.revoke(storedToken.id);

    // Save the new refresh token record
    await this.storeRefreshToken(userId, newRefreshToken);
  }

  /**
   * Revoke all active refresh tokens for a user (logout)
   */
  async revokeAllForUser(userId: string): Promise<void> {
    await this.userRefreshTokensRepository.deleteAllForUser(userId);
  }
}
