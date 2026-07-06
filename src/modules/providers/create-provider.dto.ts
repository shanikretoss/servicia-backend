import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty({ description: 'The name of the provider' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'The slug of the provider' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ description: 'The category of the provider' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ description: 'The status of the provider' })
  @IsString()
  @IsNotEmpty()
  status!: string;
}
