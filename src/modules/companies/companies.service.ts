import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { CompaniesRepository } from './repositories/companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyDto } from './dto/company.dto';
import { OrganizationsService } from '../organizations/organizations.service';
import { RolesService } from '../roles/roles.service';
import { MembershipsService } from '../memberships/memberships.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    @Inject(forwardRef(() => OrganizationsService))
    private readonly organizationsService: OrganizationsService,
    private readonly rolesService: RolesService,
    @Inject(forwardRef(() => MembershipsService))
    private readonly membershipsService: MembershipsService,
  ) {}

  async findAll(): Promise<CompanyDto[]> {
    return this.companiesRepository.findAll();
  }

  async findOne(id: string): Promise<CompanyDto> {
    const item = await this.companiesRepository.findById(id);
    if (!item) {
      throw new NotFoundException('Company not found');
    }
    return item;
  }

  async findByOrganizationId(organizationId: string): Promise<CompanyDto[]> {
    return this.companiesRepository.findByOrganizationId(organizationId);
  }

  async create(input: CreateCompanyDto, userId?: string): Promise<CompanyDto> {
    // Validate Organization exists
    await this.organizationsService.findOne(input.organizationId);

    // Check if this is the first company in this organization
    const existingCompanies = await this.companiesRepository.findByOrganizationId(input.organizationId);

    // Create the company
    const company = await this.companiesRepository.create(input);

    // If it's the first company of the organization and userId is provided, create Owner membership
    if (existingCompanies.length === 0 && userId) {
      const ownerRole = await this.rolesService.findBySlug('owner');
      if (ownerRole) {
        await this.membershipsService.create({
          userId,
          companyId: company.id,
          roleId: ownerRole.id,
          status: 'active',
        });
      }
    }

    return company;
  }
}
