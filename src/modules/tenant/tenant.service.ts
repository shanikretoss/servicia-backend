import { Injectable, ForbiddenException } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import { MembershipsService } from '../memberships/memberships.service';
import { CompanyDto } from '../companies/dto/company.dto';
import { MembershipDto } from '../memberships/dto/membership.dto';

@Injectable()
export class TenantService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly membershipsService: MembershipsService,
  ) {}

  /**
   * Resolves and validates the tenant (company) context for a given user
   */
  async resolveTenantContext(
    userId: string,
    companyId: string,
  ): Promise<{ company: CompanyDto; membership: MembershipDto }> {
    // 1. Resolve and validate company existence (throws NotFoundException internally if missing)
    const company = await this.companiesService.findOne(companyId);

    // 2. Resolve and validate user membership in company
    const membership = await this.membershipsService.findByUserAndCompany(userId, companyId);
    if (!membership) {
      throw new ForbiddenException('You do not belong to this company');
    }

    return { company, membership };
  }
}
