import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyDto } from './dto/company.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Created successfully', type: CompanyDto })
  async create(
    @Body() input: CreateCompanyDto,
    @CurrentUser() user: any,
  ): Promise<CompanyDto> {
    return this.companyService.create(input, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ status: 200, description: 'List of companies', type: [CompanyDto] })
  async findAll(): Promise<CompanyDto[]> {
    return this.companyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiResponse({ status: 200, description: 'Found record', type: CompanyDto })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Param('id') id: string): Promise<CompanyDto> {
    return this.companyService.findOne(id);
  }
}
