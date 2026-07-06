import { Injectable, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { PasswordHelper } from './helpers/password.helper';
import { JwtHelper } from './helpers/jwt.helper';
import { RefreshTokenService } from './services/refresh-token.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { buildLoginResponse, AuthErrors } from './helpers/auth-response.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordHelper: PasswordHelper,
    private readonly jwtHelper: JwtHelper,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<any> {
    // 1. Check if email already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw AuthErrors.emailAlreadyExists();
    }

    // 2. Hash password
    const hashedPassword = await this.passwordHelper.hashPassword(registerDto.password);

    // 3. Create user in the database
    const user = await this.usersService.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: hashedPassword,
    });

    // 4. Generate access token
    const accessToken = await this.jwtHelper.generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    // 5. Build and return standardized response
    const tokens = {
      accessToken,
      tokenType: 'Bearer',
    };

    const userPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return buildLoginResponse(userPayload, tokens, 'User registered successfully');
  }

  /**
   * Authenticate a user and return access token
   */
  async login(loginDto: LoginDto): Promise<any> {
    // 1. Find user by email (including password hash for verification)
    const user = await this.usersService.findByEmailWithPassword(loginDto.email);
    if (!user) {
      throw AuthErrors.invalidCredentials();
    }

    // 2. Compare password
    const isPasswordValid = await this.passwordHelper.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw AuthErrors.invalidCredentials();
    }

    // 3. Generate access and refresh tokens
    const accessToken = await this.jwtHelper.generateAccessToken({
      sub: user.id,
      email: user.email,
    });
    const refreshToken = await this.jwtHelper.generateRefreshToken({
      sub: user.id,
      email: user.email,
    });

    // Store refresh token in the database using RefreshTokenService
    await this.refreshTokenService.storeRefreshToken(user.id, refreshToken);

    // 4. Build and return standardized response
    const tokens = {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
    };

    const userPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return buildLoginResponse(userPayload, tokens, 'Login successful');
  }

  /**
   * Refresh the access token using a valid refresh token
   */
  async refreshToken(refreshDto: RefreshDto): Promise<any> {
    const { refreshToken } = refreshDto;

    // 1. Verify JWT signature and expiration
    let payload: any;
    try {
      payload = await this.jwtHelper.verifyRefreshToken(refreshToken);
    } catch (e) {
      throw AuthErrors.invalidOrExpiredToken();
    }

    // 2. Find the user
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw AuthErrors.invalidOrExpiredToken();
    }

    // 3. Generate new access token
    const newAccessToken = await this.jwtHelper.generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    // 4. Rotate Refresh Token: generate new one
    const newRefreshToken = await this.jwtHelper.generateRefreshToken({
      sub: user.id,
      email: user.email,
    });

    // 5. Rotate the token record in the database using RefreshTokenService
    await this.refreshTokenService.rotateRefreshToken(refreshToken, newRefreshToken, user.id);

    // 6. Return new token pair
    const tokens = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenType: 'Bearer',
    };

    const userPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return buildLoginResponse(userPayload, tokens, 'Token refreshed successfully');
  }

  /**
   * Get the profile details of the authenticated user
   */
  async getProfile(userId: string): Promise<UserDto> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw AuthErrors.userNotFound();
    }
    return user;
  }

  /**
   * Log out a user and invalidate their session/tokens
   */
  async logout(userId: string): Promise<void> {
    await this.refreshTokenService.revokeAllForUser(userId);
  }

  /**
   * Initiate forgot password flow by sending a reset email
   * (Placeholder for forgot password milestone)
   */
  async forgotPassword(email: string): Promise<void> {
    throw new NotImplementedException('Forgot password logic is not implemented.');
  }

  /**
   * Reset the user password using a verified reset token
   * (Placeholder for reset password milestone)
   */
  async resetPassword(resetToken: string, resetData: any): Promise<void> {
    throw new NotImplementedException('Reset password logic is not implemented.');
  }

  /**
   * Verify a user's email address using a verification token
   * (Placeholder for email verification milestone)
   */
  async verifyEmail(verificationToken: string): Promise<void> {
    throw new NotImplementedException('Email verification logic is not implemented.');
  }

  /**
   * Enable Multi-Factor Authentication (MFA) for a user
   * (Placeholder for MFA milestone)
   */
  async enableMfa(userId: string): Promise<any> {
    throw new NotImplementedException('Enable MFA logic is not implemented.');
  }

  /**
   * Disable Multi-Factor Authentication (MFA) for a user
   * (Placeholder for MFA milestone)
   */
  async disableMfa(userId: string): Promise<void> {
    throw new NotImplementedException('Disable MFA logic is not implemented.');
  }

  /**
   * Verify an MFA code/token
   * (Placeholder for MFA milestone)
   */
  async verifyMfa(userId: string, code: string): Promise<any> {
    throw new NotImplementedException('Verify MFA logic is not implemented.');
  }
}
