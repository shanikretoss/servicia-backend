import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The first name of the user' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ description: 'The last name of the user' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
