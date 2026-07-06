import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class QueryMembershipsDto {
  @ApiPropertyOptional({ description: 'Filter memberships by company UUID' })
  @IsUUID()
  @IsOptional()
  companyId?: string;
}
