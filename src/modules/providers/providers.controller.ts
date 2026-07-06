import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './create-provider.dto';
import { ProviderDto } from './provider.dto';

@ApiTags('Providers')
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
  async findAll(): Promise<ProviderDto[]> {
    return this.providerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a provider by ID' })
  @ApiResponse({ status: 200, description: 'Found record', type: ProviderDto })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Param('id') id: string): Promise<ProviderDto> {
    const item = await this.providerService.findOne(id);
    if (!item) {
      throw new NotFoundException('Provider not found');
    }
    return item;
  }
}
