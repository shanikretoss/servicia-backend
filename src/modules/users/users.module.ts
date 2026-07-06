import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repositories/users.repository';
import { MembershipsRepository } from './repositories/memberships.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, MembershipsRepository],
  exports: [UsersService, MembershipsRepository],
})
export class UsersModule {}
