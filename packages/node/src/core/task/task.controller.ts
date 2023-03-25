import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Session,
} from '@nestjs/common';
import { OPERATION_TYPE } from 'src/contant/const';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Controller()
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async findAndCountAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.taskService.findAndCountAll(page, limit);
  }

  @Get(':id')
  async findOneBy(@Param('id') id: string): Promise<Task> {
    return await this.taskService.findOneBy(id);
  }

  @Post()
  async create(@Session() session, @Body() task: Task): Promise<Task> {
    return await this.taskService.create(session, task);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() task: Task & { updateType: OPERATION_TYPE },
  ): Promise<Task> {
    return await this.taskService.update(id, task);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.taskService.remove(id);
  }
}
