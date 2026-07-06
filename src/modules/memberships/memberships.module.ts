import { Module, forwardRef } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsRepository } from './repositories/memberships.repository';
import { MembershipsController } from './memberships.controller';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';
import { RolesModule } from '../roles/roles.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => CompaniesModule),
    RolesModule,
    forwardRef(() => OrganizationsModule),
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsRepository],
  exports: [MembershipsService],
})
export class MembershipsModule {}

