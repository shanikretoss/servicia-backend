import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { PasswordHelper } from './helpers/password.helper';
import { JwtHelper } from './helpers/jwt.helper';
import { RefreshTokenHelper } from './helpers/refresh-token.helper';
import { UserRefreshTokensRepository } from './repositories/user-refresh-tokens.repository';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('auth.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.jwt.expiresIn') as unknown as number,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, PasswordHelper, JwtHelper, RefreshTokenHelper, UserRefreshTokensRepository, RefreshTokenService],
  exports: [AuthService, PasswordHelper, JwtHelper, RefreshTokenHelper, UserRefreshTokensRepository, RefreshTokenService],
})
export class AuthModule {}
