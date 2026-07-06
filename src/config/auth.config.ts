import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_change_me_in_prod',
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
}));
