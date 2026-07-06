import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface IApiErrorResponse {
  success: boolean;
  message: string;
  errors: unknown[];
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors: unknown[] = [];

    if (exception instanceof HttpException) {
      const resContent = exception.getResponse() as
        | string
        | Record<string, unknown>;
      if (resContent && typeof resContent === 'object') {
        message = (resContent.message as string) || exception.message;
        // If Nest validation pipe throws validation errors, resContent.message is an array of details
        if (Array.isArray(resContent.message)) {
          errors = resContent.message;
          message = 'Validation failed';
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: IApiErrorResponse = {
      success: false,
      message,
      errors,
    };

    const errorStack = exception instanceof Error ? exception.stack : undefined;
    this.logger.error(
      `[HTTP Exception] Status: ${status} | Message: ${message}`,
      errorStack,
    );

    // Make sure response is defined
    if (response && typeof response.status === 'function') {
      response.status(status).json(errorResponse);
    }
  }
}
