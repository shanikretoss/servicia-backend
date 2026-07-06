import { Module, forwardRef } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { CompaniesModule } from '../companies/companies.module';
import { MembershipsModule } from '../memberships/memberships.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    forwardRef(() => CompaniesModule),
    MembershipsModule,
    RolesModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsRepository],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
