import { Module, forwardRef } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CompanyContextGuard } from './guards/company-context.guard';
import { CompaniesModule } from '../companies/companies.module';
import { MembershipsModule } from '../memberships/memberships.module';

@Module({
  imports: [
    CompaniesModule,
    forwardRef(() => MembershipsModule),
  ],
  providers: [TenantService, CompanyContextGuard],
  exports: [TenantService, CompanyContextGuard],
})
export class TenantModule {}
