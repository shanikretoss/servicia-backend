import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { MembershipDto } from './dto/membership.dto';
import { QueryMembershipsDto } from './dto/query-memberships.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CompanyContextGuard } from '../tenant/guards/company-context.guard';
import { CurrentCompany } from '../tenant/decorators/current-company.decorator';

@ApiTags('Memberships')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-company-id',
  required: true,
  description: 'Company context UUID required for permission validation',
})
@UseGuards(JwtAuthGuard, CompanyContextGuard, PermissionGuard)
@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  @RequirePermissions({ module: 'membership', action: 'create' })
  @ApiOperation({ summary: 'Assign a user to a company with a role' })
  @ApiResponse({
    status: 201,
    description: 'Assigned successfully',
    type: MembershipDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request or duplicate membership',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden context or insufficient permission',
  })
  @ApiResponse({
    status: 404,
    description: 'User, company, or role not found',
  })
  async create(@Body() input: CreateMembershipDto): Promise<MembershipDto> {
    return this.membershipsService.create(input);
  }

  @Get()
  @RequirePermissions({ module: 'membership', action: 'read' })
  @ApiOperation({ summary: 'List all memberships' })
  @ApiResponse({
    status: 200,
    description: 'List of memberships',
    type: [MembershipDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden context or insufficient permission',
  })
  async findAll(@CurrentCompany() company: any): Promise<MembershipDto[]> {
    return this.membershipsService.findAll(company.id);
  }

  @Get(':id')
  @RequirePermissions({ module: 'membership', action: 'read' })
  @ApiOperation({ summary: 'Get membership details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Found record',
    type: MembershipDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden context or insufficient permission',
  })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentCompany() company: any,
  ): Promise<MembershipDto> {
    return this.membershipsService.findOne(id, company.id);
  }

  @Patch(':id')
  @RequirePermissions({ module: 'membership', action: 'update' })
  @ApiOperation({ summary: 'Update the assigned role of a membership' })
  @ApiResponse({
    status: 200,
    description: 'Updated successfully',
    type: MembershipDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden context or insufficient permission',
  })
  @ApiResponse({
    status: 404,
    description: 'Membership or Role not found',
  })
  async update(
    @Param('id') id: string,
    @Body() input: UpdateMembershipDto,
    @CurrentCompany() company: any,
  ): Promise<MembershipDto> {
    return this.membershipsService.update(id, input, company.id);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'membership', action: 'delete' })
  @ApiOperation({ summary: 'Remove a membership' })
  @ApiResponse({ status: 200, description: 'Removed successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden context or insufficient permission',
  })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  async remove(
    @Param('id') id: string,
    @CurrentCompany() company: any,
  ): Promise<void> {
    return this.membershipsService.remove(id, company.id);
  }
}
