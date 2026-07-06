import { Module, forwardRef } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsRepository } from './repositories/memberships.repository';
import { MembershipsController } from './memberships.controller';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';
import { RolesModule } from '../roles/roles.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => CompaniesModule),
    RolesModule,
    forwardRef(() => OrganizationsModule),
    forwardRef(() => TenantModule),
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsRepository],
  exports: [MembershipsService],
})
export class MembershipsModule {}

