import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<UserDto[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<UserDto | null> {
    return this.usersRepository.findById(id);
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    return this.usersRepository.findByEmail(email);
  }

  async create(input: CreateUserDto): Promise<UserDto> {
    return this.usersRepository.create(input);
  }
}
