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
  Req,
} from '@nestjs/common';
import { OPERATION_TYPE } from 'src/contant/const';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Controller()
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async findAndCountAll(@Req() req) {
    return await this.taskService.findAndCountAll(req);
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
    @Session() session,
    @Param('id') id: string,
    @Body() task: Task & { operationType: OPERATION_TYPE },
  ): Promise<Task> {
    return await this.taskService.update(session, id, task);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.taskService.remove(id);
  }
}
