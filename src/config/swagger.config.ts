import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  path: '/api/docs',
  title: 'Servicia SaaS Backend API',
  description:
    'Production-grade backend core REST API documentation for Servicia platform',
  version: '1.0.0',
}));
