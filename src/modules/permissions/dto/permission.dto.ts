import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty({ description: 'The UUID ID of the permission' })
  id!: string;

  @ApiProperty({ description: 'The module of the permission' })
  module!: string;

  @ApiProperty({ description: 'The action of the permission' })
  action!: string;

  @ApiProperty({ description: 'The creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'The update timestamp' })
  updatedAt!: Date;
}
