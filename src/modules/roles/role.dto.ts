import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({ description: 'The UUID ID of the role' })
  id!: string;

  @ApiProperty({ description: 'The name of the role' })
  name!: string;

  @ApiProperty({ description: 'The slug of the role' })
  slug!: string;

  @ApiProperty({ description: 'The description of the role' })
  description!: string | null;

  @ApiProperty({ description: 'If this is a system role' })
  isSystem!: boolean;

  @ApiProperty({ description: 'The creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'The update timestamp' })
  updatedAt!: Date;
}
