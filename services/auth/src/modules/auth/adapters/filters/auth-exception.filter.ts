import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

import {
  AuthException,
  UserNotFoundException,
  InvalidCredentialsException,
  UserAlreadyExistsException,
  InvalidTokenException,
} from '../../core/exceptions/auth.exception';

@Catch(AuthException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: AuthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof UserNotFoundException) {
      return response.status(404).json({
        statusCode: 404,
        message: exception.message,
      });
    }

    if (exception instanceof InvalidCredentialsException) {
      return response.status(401).json({
        statusCode: 401,
        message: exception.message,
      });
    }

    if (exception instanceof UserAlreadyExistsException) {
      return response.status(409).json({
        statusCode: 409,
        message: exception.message,
      });
    }

    if (exception instanceof InvalidTokenException) {
      return response.status(401).json({
        statusCode: 401,
        message: exception.message,
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
