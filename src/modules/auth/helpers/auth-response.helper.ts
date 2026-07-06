import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  TokenPayload,
  AuthSuccessResponse,
  AuthUserPayload,
  LoginResponseData,
} from '../interfaces/auth.interface';

/**
 * Standard utility function to construct a success response
 */
export function buildAuthSuccessResponse<T = any>(
  message: string,
  data?: T,
): AuthSuccessResponse<T> {
  return {
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  };
}

/**
 * Standard utility function to construct a token payload
 */
export function buildTokenPayload(
  accessToken: string,
  refreshToken?: string,
  expiresIn?: string | number,
): TokenPayload {
  return {
    accessToken,
    ...(refreshToken ? { refreshToken } : {}),
    ...(expiresIn ? { expiresIn } : {}),
    tokenType: 'Bearer',
  };
}

/**
 * Standard utility function to build a login/registration response
 */
export function buildLoginResponse(
  user: AuthUserPayload,
  tokens: TokenPayload,
  message = 'Authentication successful',
): AuthSuccessResponse<LoginResponseData> {
  return buildAuthSuccessResponse(message, {
    user,
    tokens,
  });
}

/**
 * Reusable error factories to ensure standardized exception messages and statuses
 * that integrate seamlessly with the global HttpExceptionFilter.
 */
export const AuthErrors = {
  invalidCredentials(message = 'Invalid email or password'): UnauthorizedException {
    return new UnauthorizedException(message);
  },

  emailAlreadyExists(message = 'Email address is already registered'): ConflictException {
    return new ConflictException(message);
  },

  invalidOrExpiredToken(message = 'Token is invalid or has expired'): UnauthorizedException {
    return new UnauthorizedException(message);
  },

  unverifiedEmail(message = 'Email address is not verified'): ForbiddenException {
    return new ForbiddenException(message);
  },

  mfaRequired(message = 'Multi-factor authentication code is required'): UnauthorizedException {
    return new UnauthorizedException(message);
  },

  invalidMfaCode(message = 'Invalid multi-factor authentication code'): BadRequestException {
    return new BadRequestException(message);
  },

  userNotFound(message = 'User not found'): NotFoundException {
    return new NotFoundException(message);
  },

  invalidResetToken(message = 'Invalid or expired password reset token'): BadRequestException {
    return new BadRequestException(message);
  },
};
