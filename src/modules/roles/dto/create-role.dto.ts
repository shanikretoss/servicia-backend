import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'The name of the role' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'The slug of the role' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ description: 'The description of the role' })
  @IsString()
  @IsOptional()
  description!: string;

  @ApiProperty({ description: 'If this is a system role' })
  @IsBoolean()
  @IsOptional()
  isSystem!: boolean;
}
