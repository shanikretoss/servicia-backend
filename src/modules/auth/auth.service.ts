import { Injectable, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PasswordHelper } from './helpers/password.helper';
import { JwtHelper } from './helpers/jwt.helper';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { buildLoginResponse, AuthErrors } from './helpers/auth-response.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordHelper: PasswordHelper,
    private readonly jwtHelper: JwtHelper,
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
   * (Placeholder for refresh token milestone)
   */
  async refreshToken(refreshToken: string): Promise<any> {
    throw new NotImplementedException('Token refresh logic is not implemented.');
  }

  /**
   * Log out a user and invalidate their session/tokens
   * (Placeholder for logout milestone)
   */
  async logout(userId: string): Promise<void> {
    throw new NotImplementedException('Logout logic is not implemented.');
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
