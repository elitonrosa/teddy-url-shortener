import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import {
  ShortCodeCollisionException,
  UnauthorizedListException,
} from '../../core/exceptions/short-url.exception';
import { ShortUrlNotFoundException } from '../../core/exceptions/short-url.exception';
import { UnauthorizedDeleteException } from '../../core/exceptions/short-url.exception';
import { UnauthorizedUpdateException } from '../../core/exceptions/short-url.exception';

@Catch()
export class ShortUrlExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    if (exception instanceof ShortUrlNotFoundException) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
      });
    }

    if (exception instanceof ShortCodeCollisionException) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: exception.message,
      });
    }

    if (
      exception instanceof UnauthorizedDeleteException ||
      exception instanceof UnauthorizedUpdateException
    ) {
      return response.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        message: exception.message,
      });
    }

    if (exception instanceof UnauthorizedListException) {
      return response.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        message: exception.message,
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
