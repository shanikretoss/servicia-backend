import { Injectable } from '@nestjs/common';
import { ProvidersRepository } from './repositories/providers.repository';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderDto } from './dto/provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly providersRepository: ProvidersRepository) {}

  async findAll(): Promise<ProviderDto[]> {
    return this.providersRepository.findAll();
  }

  async findOne(id: string): Promise<ProviderDto | null> {
    return this.providersRepository.findById(id);
  }

  async create(input: CreateProviderDto): Promise<ProviderDto> {
    return this.providersRepository.create(input);
  }
}
