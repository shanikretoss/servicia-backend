import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './create-user.dto';
import { UserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserDto[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<UserDto | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(input: CreateUserDto): Promise<UserDto> {
    return this.prisma.user.create({ data: input });
  }
}
