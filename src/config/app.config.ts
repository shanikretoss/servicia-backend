import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  version: process.env.APP_VERSION || '1.0.0',
  apiPrefix: process.env.API_PREFIX || 'api',
}));
