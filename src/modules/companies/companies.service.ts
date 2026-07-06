import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { CompaniesRepository } from './repositories/companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyDto } from './dto/company.dto';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    @Inject(forwardRef(() => OrganizationsService))
    private readonly organizationsService: OrganizationsService,
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

  async create(input: CreateCompanyDto): Promise<CompanyDto> {
    if (input.organizationId) {
      await this.organizationsService.findOne(input.organizationId);
    }
    return this.companiesRepository.create(input);
  }
}
