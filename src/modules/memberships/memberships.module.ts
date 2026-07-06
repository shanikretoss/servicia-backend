import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsRepository } from './repositories/memberships.repository';
import { MembershipsController } from './memberships.controller';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [UsersModule, CompaniesModule, RolesModule],
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsRepository],
  exports: [MembershipsService],
})
export class MembershipsModule {}

