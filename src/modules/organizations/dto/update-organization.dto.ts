import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ description: 'The name of the organization' })
  @IsString()
  @IsOptional()
  name?: string;
}
