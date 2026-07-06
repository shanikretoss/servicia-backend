import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { MembershipsRepository } from './repositories/memberships.repository';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { MembershipDto } from './dto/membership.dto';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { RolesService } from '../roles/roles.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class MembershipsService {
  constructor(
    private readonly membershipsRepository: MembershipsRepository,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => CompaniesService))
    private readonly companiesService: CompaniesService,
    private readonly rolesService: RolesService,
    @Inject(forwardRef(() => OrganizationsService))
    private readonly organizationsService: OrganizationsService,
  ) {}

  /**
   * Find all memberships for a given user
   */
  async findByUserId(userId: string): Promise<MembershipDto[]> {
    return this.membershipsRepository.findByUserId(userId);
  }

  /**
   * Find all memberships with optional filtering
   */
  async findAll(companyId: string): Promise<MembershipDto[]> {
    return this.membershipsRepository.findAll({ companyId });
  }

  /**
   * Find a specific membership by ID
   */
  async findOne(id: string, companyId: string): Promise<MembershipDto> {
    return this.findAndValidateMembership(id, companyId);
  }

  /**
   * Find a user's membership within a specific company
   */
  async findByUserAndCompany(userId: string, companyId: string): Promise<MembershipDto | null> {
    return this.membershipsRepository.findByUserAndCompany(userId, companyId);
  }

  /**
   * Create a new membership
   */
  async create(input: CreateMembershipDto): Promise<MembershipDto> {
    // Validate User exists
    await this.validateUserExists(input.userId);

    // Validate Company exists (throws NotFoundException internally)
    const company = await this.companiesService.findOne(input.companyId);

    // Validate Organization exists through the Company relationship (throws NotFoundException internally)
    if (!company.organizationId) {
      throw new BadRequestException('Company does not belong to an Organization');
    }
    await this.organizationsService.findOne(company.organizationId);

    // Validate Role exists
    await this.validateRoleExists(input.roleId);

    // Check if membership already exists
    const existing = await this.membershipsRepository.findByUserAndCompany(input.userId, input.companyId);
    if (existing) {
      throw new BadRequestException('User is already a member of this company');
    }

    return this.membershipsRepository.create(input);
  }

  /**
   * Update the role or status of a membership
   */
  async update(
    id: string,
    data: Partial<Pick<CreateMembershipDto, 'roleId' | 'status'>>,
    companyId: string,
  ): Promise<MembershipDto> {
    const existing = await this.findAndValidateMembership(id, companyId);

    const ownerRole = await this.rolesService.findBySlug('owner');

    // Prevent changing the last Owner to another role
    if (data.roleId && ownerRole && data.roleId !== ownerRole.id) {
      const isLast = await this.isLastRemainingOwner(existing);
      if (isLast) {
        throw new BadRequestException('Cannot change the role of the last remaining Owner');
      }
    }

    if (data.roleId) {
      await this.validateRoleExists(data.roleId);
    }

    return this.membershipsRepository.update(id, data);
  }

  /**
   * Remove a membership
   */
  async remove(id: string, companyId: string): Promise<void> {
    const existing = await this.findAndValidateMembership(id, companyId);

    const isLast = await this.isLastRemainingOwner(existing);
    if (isLast) {
      throw new BadRequestException('Cannot remove the last remaining Owner of the company');
    }

    await this.membershipsRepository.delete(id);
  }

  /**
   * Helper to retrieve a membership and validate its existence
   */
  private async findAndValidateMembership(id: string, companyId: string): Promise<MembershipDto> {
    const membership = await this.membershipsRepository.findById(id, companyId);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }
    return membership;
  }

  /**
   * Helper to validate that a user exists
   */
  private async validateUserExists(userId: string): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  /**
   * Helper to validate that a role exists
   */
  private async validateRoleExists(roleId: string): Promise<void> {
    const role = await this.rolesService.findOne(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
  }

  /**
   * Check if a membership is the last remaining owner in its company
   */
  private async isLastRemainingOwner(membership: MembershipDto): Promise<boolean> {
    const ownerRole = await this.rolesService.findBySlug('owner');
    if (!ownerRole) {
      return false;
    }

    // Check if the membership itself has the Owner role
    if (membership.roleId !== ownerRole.id) {
      return false;
    }

    // Fetch all memberships of the company
    const companyMemberships = await this.membershipsRepository.findByCompanyId(membership.companyId);

    // Count how many have the Owner role
    const owners = companyMemberships.filter((m) => m.roleId === ownerRole.id);

    return owners.length <= 1;
  }
}
