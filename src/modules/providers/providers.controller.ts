import { Controller, Get, Post, Body, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderDto } from './dto/provider.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CompanyContextGuard } from '../tenant/guards/company-context.guard';
import { CurrentCompany } from '../tenant/decorators/current-company.decorator';

@ApiTags('Providers')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-company-id',
  required: true,
  description: 'Company context UUID required for tenant validation',
})
@UseGuards(JwtAuthGuard, CompanyContextGuard)
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providerService: ProvidersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new provider' })
  @ApiResponse({ status: 201, description: 'Created successfully', type: ProviderDto })
  async create(@Body() input: CreateProviderDto): Promise<ProviderDto> {
    return this.providerService.create(input);
  }

  @Get()
  @ApiOperation({ summary: 'Get all providers' })
  @ApiResponse({ status: 200, description: 'List of providers', type: [ProviderDto] })
  async findAll(@CurrentCompany() company: any): Promise<ProviderDto[]> {
    return this.providerService.findAll(company.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a provider by ID' })
  @ApiResponse({ status: 200, description: 'Found record', type: ProviderDto })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentCompany() company: any,
  ): Promise<ProviderDto> {
    const item = await this.providerService.findOne(id, company.id);
    if (!item) {
      throw new NotFoundException('Provider not found');
    }
    return item;
  }
}
