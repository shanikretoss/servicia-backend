import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCompanyDto } from './create-company.dto';
import { CompanyDto } from './company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CompanyDto[]> {
    return this.prisma.company.findMany();
  }

  async findOne(id: string): Promise<CompanyDto | null> {
    return this.prisma.company.findUnique({ where: { id } });
  }

  async create(input: CreateCompanyDto): Promise<CompanyDto> {
    return this.prisma.company.create({ data: input });
  }
}
