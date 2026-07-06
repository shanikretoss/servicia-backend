import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationDto } from './dto/organization.dto';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
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
  async create(@Body() input: CreateOrganizationDto): Promise<OrganizationDto> {
    return this.organizationsService.create(input);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'List of organizations',
    type: [OrganizationDto],
  })
  async findAll(): Promise<OrganizationDto[]> {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({
    status: 200,
    description: 'Found record',
    type: OrganizationDto,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async findOne(@Param('id') id: string): Promise<OrganizationDto> {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
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
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async update(
    @Param('id') id: string,
    @Body() input: UpdateOrganizationDto,
  ): Promise<OrganizationDto> {
    return this.organizationsService.update(id, input);
  }
}
