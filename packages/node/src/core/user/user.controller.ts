import { Controller, Get, Post, Put, Delete, Param, Body, Query  } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

export interface PaginatedUsers {
  total: number;
  data: User[];
}

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedUsers> {
    return this.userService.findAll(offset, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | undefined> {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUser: User): Promise<User | undefined> {
    return this.userService.update(id, updateUser);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
