import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMembershipDto {
  @ApiProperty({ description: 'The UUID of the user' })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ description: 'The UUID of the company' })
  @IsUUID()
  @IsNotEmpty()
  companyId!: string;

  @ApiProperty({ description: 'The UUID of the role to assign' })
  @IsUUID()
  @IsNotEmpty()
  roleId!: string;

  @ApiProperty({ description: 'The membership status', example: 'active' })
  @IsString()
  @IsNotEmpty()
  status!: string;
}
