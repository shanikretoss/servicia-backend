import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { ProvidersRepository } from './repositories/providers.repository';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [TenantModule],
  controllers: [ProvidersController],
  providers: [ProvidersService, ProvidersRepository],
  exports: [ProvidersService],
})
export class ProvidersModule {}
