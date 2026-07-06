import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MembershipsRepository } from './repositories/memberships.repository';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { MembershipDto } from './dto/membership.dto';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class MembershipsService {
  constructor(
    private readonly membershipsRepository: MembershipsRepository,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly rolesService: RolesService,
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
  async findAll(filter?: { companyId?: string }): Promise<MembershipDto[]> {
    return this.membershipsRepository.findAll(filter);
  }

  /**
   * Find a specific membership by ID
   */
  async findOne(id: string): Promise<MembershipDto> {
    return this.findAndValidateMembership(id);
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
    const user = await this.usersService.findOne(input.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate Company exists
    const company = await this.companiesService.findOne(input.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

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
  ): Promise<MembershipDto> {
    await this.findAndValidateMembership(id);

    if (data.roleId) {
      await this.validateRoleExists(data.roleId);
    }

    return this.membershipsRepository.update(id, data);
  }

  /**
   * Remove a membership
   */
  async remove(id: string): Promise<void> {
    await this.findAndValidateMembership(id);
    await this.membershipsRepository.delete(id);
  }

  /**
   * Helper to retrieve a membership and validate its existence
   */
  private async findAndValidateMembership(id: string): Promise<MembershipDto> {
    const membership = await this.membershipsRepository.findById(id);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }
    return membership;
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
}
