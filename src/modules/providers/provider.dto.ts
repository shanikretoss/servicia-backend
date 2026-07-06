import { ApiProperty } from '@nestjs/swagger';

export class ProviderDto {
  @ApiProperty({ description: 'The UUID ID of the provider' })
  id!: string;

  @ApiProperty({ description: 'The name of the provider' })
  name!: string;

  @ApiProperty({ description: 'The slug of the provider' })
  slug!: string;

  @ApiProperty({ description: 'The category of the provider' })
  category!: string;

  @ApiProperty({ description: 'The status of the provider' })
  status!: string;

  @ApiProperty({ description: 'The creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'The update timestamp' })
  updatedAt!: Date;
}
