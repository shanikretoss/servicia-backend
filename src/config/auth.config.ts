import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key_change_me_in_prod',
    expiresIn: process.env.JWT_EXPIRATION || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key_change_me_in_prod',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
}));
