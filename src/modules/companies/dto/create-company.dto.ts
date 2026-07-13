import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ description: 'The name of the company' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'The status of the company' })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiProperty({ description: 'The creator user UUID' })
  @IsString()
  @IsOptional()
  createdBy!: string;
}
