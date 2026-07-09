import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const winstonOptions: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('Servicia', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
  ],
};

async function bootstrap() {
  // Override default Logger with custom Winston Logger
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonOptions),
  });

  const configService = app.get(ConfigService);

  // Set global REST API prefix (defaults to 'api')
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Configure REST URI Versioning (e.g. /api/v1/...)
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configure Swagger Documentation
  const swaggerTitle =
    configService.get<string>('swagger.title') || 'Servicia SaaS Backend API';
  const swaggerDesc =
    configService.get<string>('swagger.description') ||
    'Production core API documentation';
  const swaggerVersion =
    configService.get<string>('swagger.version') || '1.0.0';

  const swaggerConfig = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDesc)
    .setVersion(swaggerVersion)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = configService.get<string>('swagger.path') || '/api/docs';
  const cleanSwaggerPath = swaggerPath.startsWith('/')
    ? swaggerPath.slice(1)
    : swaggerPath;

  SwaggerModule.setup(cleanSwaggerPath, app, document);

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
}
void bootstrap();
