import { ApiProperty } from '@nestjs/swagger';

export class CompanyDto {
  @ApiProperty({ description: 'The UUID ID of the company' })
  id!: string;

  @ApiProperty({ description: 'The name of the company' })
  name!: string;

  @ApiProperty({ description: 'The slug of the company' })
  slug!: string;

  @ApiProperty({ description: 'The status of the company' })
  status!: string;

  @ApiProperty({ description: 'The creator user UUID' })
  createdBy!: string | null;

  @ApiProperty({ description: 'The creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'The update timestamp' })
  updatedAt!: Date;
}
