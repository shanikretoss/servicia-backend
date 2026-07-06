import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHelper {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generate an access token for a user
   * @param payload Token payload containing sub and email
   * @returns Generated access token string
   */
  async generateAccessToken(payload: { sub: string; email: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
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
