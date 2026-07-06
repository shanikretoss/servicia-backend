import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from './repositories/companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  async findAll(): Promise<CompanyDto[]> {
    return this.companiesRepository.findAll();
  }

  async findOne(id: string): Promise<CompanyDto | null> {
    return this.companiesRepository.findById(id);
  }

  async create(input: CreateCompanyDto): Promise<CompanyDto> {
    return this.companiesRepository.create(input);
  }
}
