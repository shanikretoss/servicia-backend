import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configLoads } from './config';
import { PrismaModule } from './database/prisma.module';

// Import initial modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: configLoads,
    }),

    // Global Prisma Module
    PrismaModule,

    // Modules
    AuthModule,
    UsersModule,
    CompaniesModule,
    RolesModule,
    PermissionsModule,
    MembershipsModule,
    OrganizationsModule,
    TenantModule,
    HealthModule,
  ],
  providers: [],
})
export class AppModule {}

