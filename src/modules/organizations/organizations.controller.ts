import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationDto } from './dto/organization.dto';
import { CompanyDto } from '../companies/dto/company.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('Organizations')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-company-id',
  required: true,
  description: 'Company context UUID required for permission validation',
})
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @RequirePermissions({ module: 'organization', action: 'create' })
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({
    status: 201,
    description: 'Created successfully',
    type: OrganizationDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request or duplicate name/slug',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden context or insufficient permission',
  })
  async create(@Body() input: CreateOrganizationDto): Promise<OrganizationDto> {
    return this.organizationsService.create(input);
  }

  @Get()
  @RequirePermissions({ module: 'organization', action: 'read' })
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'List of organizations',
    type: [OrganizationDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden context or insufficient permission',
  })
  async findAll(): Promise<OrganizationDto[]> {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ module: 'organization', action: 'read' })
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({
    status: 200,
    description: 'Found record',
    type: OrganizationDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden context or insufficient permission',
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async findOne(@Param('id') id: string): Promise<OrganizationDto> {
    return this.organizationsService.findOne(id);
  }

  @Get(':id/companies')
  @RequirePermissions({ module: 'organization', action: 'read' })
  @ApiOperation({ summary: 'Get all companies belonging to an organization' })
  @ApiResponse({
    status: 200,
    description: 'List of companies',
    type: [CompanyDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden context or insufficient permission',
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async findCompanies(@Param('id') id: string): Promise<CompanyDto[]> {
    return this.organizationsService.findCompanies(id);
  }

  @Patch(':id')
  @RequirePermissions({ module: 'organization', action: 'update' })
  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({
    status: 200,
    description: 'Updated successfully',
    type: OrganizationDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request or duplicate name/slug',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden context or insufficient permission',
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async update(
    @Param('id') id: string,
    @Body() input: UpdateOrganizationDto,
  ): Promise<OrganizationDto> {
    return this.organizationsService.update(id, input);
  }
}
