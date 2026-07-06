import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtHelper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate an access token for a user
   * @param payload Token payload containing sub and email
   * @returns Generated access token string
   */
  async generateAccessToken(payload: { sub: string; email: string }): Promise<string> {
    const secret = this.configService.get<string>('auth.jwt.secret');
    const expiresIn = this.configService.get<string>('auth.jwt.expiresIn');
    return this.jwtService.signAsync(payload, { secret, expiresIn: expiresIn as any });
  }

  /**
   * Generate a refresh token for a user
   * @param payload Token payload containing sub and email
   * @returns Generated refresh token string
   */
  async generateRefreshToken(payload: { sub: string; email: string }): Promise<string> {
    const secret = this.configService.get<string>('auth.jwt.refreshSecret') || 'fallback_refresh_secret_key_change_me_in_prod';
    const expiresIn = this.configService.get<string>('auth.jwt.refreshExpiresIn') || '7d';
    return this.jwtService.signAsync(payload, { secret, expiresIn: expiresIn as any });
  }

  /**
   * Verify an access token
   * @param token Access token string
   * @returns Decoded payload
   */
  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
