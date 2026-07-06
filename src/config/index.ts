import appConfig from './app.config';
import databaseConfig from './database.config';
import swaggerConfig from './swagger.config';
import authConfig from './auth.config';

export const configLoads = [
  appConfig,
  databaseConfig,
  swaggerConfig,
  authConfig,
];

export { appConfig, databaseConfig, swaggerConfig, authConfig };
