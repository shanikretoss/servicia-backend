import { ApiProperty } from '@nestjs/swagger';

export class OrganizationDto {
  @ApiProperty({ description: 'The UUID ID of the organization' })
  id!: string;

  @ApiProperty({ description: 'The name of the organization' })
  name!: string;

  @ApiProperty({ description: 'The unique slug of the organization' })
  slug!: string;

  @ApiProperty({ description: 'The creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'The update timestamp' })
  updatedAt!: Date;
}
