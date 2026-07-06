import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenHelper {
  /**
   * Hash a refresh token using SHA-256 (deterministic)
   * @param token Raw refresh token string
   * @returns Hashed token string
   */
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Verify a raw refresh token against a stored hash
   * @param token Raw refresh token string
   * @param hash Hashed refresh token to verify against
   * @returns True if token matches, false otherwise
   */
  compareToken(token: string, hash: string): boolean {
    const hashedInput = this.hashToken(token);
    return crypto.timingSafeEqual(Buffer.from(hashedInput), Buffer.from(hash));
  }

  /**
   * Calculate refresh token expiration date from a duration string
   * @param expiresInStr Duration string (e.g. '7d', '24h')
   * @returns Calculated expiration Date
   */
  calculateExpirationDate(expiresInStr: string): Date {
    const expiresAt = new Date();
    const match = expiresInStr.match(/^(\d+)([dhm])$/);
    if (match) {
      const amount = parseInt(match[1], 10);
      const unit = match[2];
      if (unit === 'd') expiresAt.setDate(expiresAt.getDate() + amount);
      else if (unit === 'h') expiresAt.setHours(expiresAt.getHours() + amount);
      else if (unit === 'm') expiresAt.setMinutes(expiresAt.getMinutes() + amount);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 7);
    }
    return expiresAt;
  }
}
