import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Created successfully', type: RoleDto })
  async create(@Body() input: CreateRoleDto): Promise<RoleDto> {
    return this.roleService.create(input);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles', type: [RoleDto] })
  async findAll(): Promise<RoleDto[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: 200, description: 'Found record', type: RoleDto })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Param('id') id: string): Promise<RoleDto> {
    const item = await this.roleService.findOne(id);
    if (!item) {
      throw new NotFoundException('Role not found');
    }
    return item;
  }
}
