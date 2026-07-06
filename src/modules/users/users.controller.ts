import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'Created successfully', type: UserDto })
  async create(@Body() input: CreateUserDto): Promise<UserDto> {
    return this.userService.create(input);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserDto] })
  async findAll(): Promise<UserDto[]> {
    console.log('Fetching all users');
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Found record', type: UserDto })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const item = await this.userService.findOne(id);
    if (!item) {
      throw new NotFoundException('User not found');
    }
    return item;
  }
}
