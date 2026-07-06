import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'The name of the organization' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'The unique slug of the organization' })
  @IsString()
  @IsNotEmpty()
  slug!: string;
}
