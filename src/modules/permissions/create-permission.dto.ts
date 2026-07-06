import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'The module of the permission' })
  @IsString()
  @IsNotEmpty()
  module!: string;

  @ApiProperty({ description: 'The action of the permission' })
  @IsString()
  @IsNotEmpty()
  action!: string;
}
