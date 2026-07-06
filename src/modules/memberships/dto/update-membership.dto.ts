import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateMembershipDto {
  @ApiProperty({ description: 'The UUID of the role to assign' })
  @IsUUID()
  @IsNotEmpty()
  roleId!: string;
}
