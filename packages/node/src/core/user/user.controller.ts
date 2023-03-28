import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

export interface PaginatedUsers {
  total: number;
  data: User[];
}

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {
    this.userService.findAll(1, 10).then((res) => {
      if (res.total !== 0) return;
      this.userService.create({
        username: 'A1',
        nickname: 'A1',
        email: 'A@qq.com',
        password: 'xxxxx',
      });
      this.userService.create({
        username: 'A2',
        nickname: 'A2',
        email: 'A@qq.com',
        password: 'xxxxx',
      });
    });
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req,
  ): Promise<PaginatedUsers> {
    return this.userService.findAll(page, limit);
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
  async update(
    @Param('id') id: string,
    @Body() updateUser: User,
  ): Promise<User | undefined> {
    return this.userService.update(id, updateUser);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
