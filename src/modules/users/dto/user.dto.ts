import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'The UUID ID of the user' })
  id!: string;

  @ApiProperty({ description: 'The first name of the user' })
  firstName!: string;

  @ApiProperty({ description: 'The last name of the user' })
  lastName!: string;

  @ApiProperty({ description: 'The email of the user' })
  email!: string;

  @ApiProperty({ description: 'The active status of the user' })
  isActive!: boolean;

  @ApiProperty({ description: 'The creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'The update timestamp' })
  updatedAt!: Date;
}
