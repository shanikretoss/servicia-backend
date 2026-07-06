import { Injectable, NotFoundException, BadRequestException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationDto } from './dto/organization.dto';
import { CompaniesService } from '../companies/companies.service';
import { CompanyDto } from '../companies/dto/company.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
    @Inject(forwardRef(() => CompaniesService))
    private readonly companiesService: CompaniesService,
  ) {}

  /**
   * Get all organizations
   */
  async findAll(): Promise<OrganizationDto[]> {
    return this.organizationsRepository.findAll();
  }

  /**
   * Get an organization by ID
   */
  async findOne(id: string): Promise<OrganizationDto> {
    const org = await this.organizationsRepository.findById(id);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return org;
  }

  /**
   * Get an organization by slug
   */
  async findBySlug(slug: string): Promise<OrganizationDto | null> {
    return this.organizationsRepository.findBySlug(slug);
  }

  /**
   * Find an organization by owner ID
   */
  async findByOwnerId(ownerId: string): Promise<OrganizationDto | null> {
    return this.organizationsRepository.findByOwnerId(ownerId);
  }

  /**
   * Create a new organization
   */
  async create(input: CreateOrganizationDto, ownerId: string): Promise<OrganizationDto> {
    // Validate that the user doesn't already own an Organization
    await this.validateUserDoesNotOwnOrganization(ownerId);

    // Validate uniqueness of the name
    const existingName = await this.organizationsRepository.findByName(input.name);
    if (existingName) {
      throw new BadRequestException('Organization with this name already exists');
    }

    // Validate uniqueness of the slug
    const existingSlug = await this.organizationsRepository.findBySlug(input.slug);
    if (existingSlug) {
      throw new BadRequestException('Organization with this slug already exists');
    }

    return this.organizationsRepository.create({
      ...input,
      ownerId,
    });
  }

  /**
   * Update an existing organization
   */
  async update(id: string, input: UpdateOrganizationDto): Promise<OrganizationDto> {
    const org = await this.organizationsRepository.findById(id);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    if (input.name && input.name !== org.name) {
      const existingName = await this.organizationsRepository.findByName(input.name);
      if (existingName) {
        throw new BadRequestException('Organization with this name already exists');
      }
    }

    if (input.slug && input.slug !== org.slug) {
      const existingSlug = await this.organizationsRepository.findBySlug(input.slug);
      if (existingSlug) {
        throw new BadRequestException('Organization with this slug already exists');
      }
    }

    return this.organizationsRepository.update(id, input);
  }

  /**
   * Find all companies belonging to an organization
   */
  async findCompanies(organizationId: string): Promise<CompanyDto[]> {
    // Validate organization exists
    await this.findOne(organizationId);

    // Fetch and return companies
    return this.companiesService.findByOrganizationId(organizationId);
  }

  /**
   * Validate that a user does not already own an organization
   */
  private async validateUserDoesNotOwnOrganization(ownerId: string): Promise<void> {
    const org = await this.organizationsRepository.findByOwnerId(ownerId);
    if (org) {
      throw new ConflictException('User already owns an Organization');
    }
  }
}
