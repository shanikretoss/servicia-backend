import { Module, forwardRef } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { CompaniesRepository } from './repositories/companies.repository';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [forwardRef(() => OrganizationsModule)],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesRepository],
  exports: [CompaniesService],
})
export class CompaniesModule {}
