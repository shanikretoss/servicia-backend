import { Injectable } from '@nestjs/common';
import { ProvidersRepository } from './repositories/providers.repository';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderDto } from './dto/provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly providersRepository: ProvidersRepository) {}

  async findAll(companyId?: string): Promise<ProviderDto[]> {
    return this.providersRepository.findAll(companyId);
  }

  async findOne(id: string, companyId?: string): Promise<ProviderDto | null> {
    return this.providersRepository.findById(id, companyId);
  }

  async create(input: CreateProviderDto): Promise<ProviderDto> {
    return this.providersRepository.create(input);
  }
}
