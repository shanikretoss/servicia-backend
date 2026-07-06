import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHelper {
  private readonly saltRounds = 10;

  /**
   * Hash a plain text password using bcrypt
   * @param password Plain text password to hash
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compare a plain text password with a bcrypt hash
   * @param password Plain text password
   * @param hash Bcrypt hash to compare against
   * @returns True if passwords match, false otherwise
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
