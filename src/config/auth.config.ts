import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key_change_me_in_prod',
    expiresIn: process.env.JWT_EXPIRATION || '1d',
  },
}));
