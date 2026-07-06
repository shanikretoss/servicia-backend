import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './create-permission.dto';
import { PermissionDto } from './permission.dto';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Created successfully', type: PermissionDto })
  async create(@Body() input: CreatePermissionDto): Promise<PermissionDto> {
    return this.permissionService.create(input);
  }

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'List of permissions', type: [PermissionDto] })
  async findAll(): Promise<PermissionDto[]> {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a permission by ID' })
  @ApiResponse({ status: 200, description: 'Found record', type: PermissionDto })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Param('id') id: string): Promise<PermissionDto> {
    const item = await this.permissionService.findOne(id);
    if (!item) {
      throw new NotFoundException('Permission not found');
    }
    return item;
  }
}
