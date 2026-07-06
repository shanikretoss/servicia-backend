import { ApiProperty } from '@nestjs/swagger';

export class MembershipDto {
  @ApiProperty({ description: 'The UUID ID of the membership' })
  id!: string;

  @ApiProperty({ description: 'The UUID of the user' })
  userId!: string;

  @ApiProperty({ description: 'The UUID of the company' })
  companyId!: string;

  @ApiProperty({ description: 'The UUID of the role assigned' })
  roleId!: string;

  @ApiProperty({ description: 'The membership status' })
  status!: string;

  @ApiProperty({ description: 'The creation timestamp' })
  createdAt!: Date;
}
