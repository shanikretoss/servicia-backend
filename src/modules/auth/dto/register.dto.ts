import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'The first name of the user' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ description: 'The last name of the user' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'The password of the user (minimum 6 characters)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
