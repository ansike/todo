import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { TaskHistory } from './taskHistory.entity';
import { TaskHistoryService } from './taskHistory.service';

@Controller()
export class TaskHistoryController {
  constructor(private taskHistoryService: TaskHistoryService) {}

  @Get()
  async findAndCountAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.taskHistoryService.findAndCountAll(page, limit);
  }

  @Get(':id')
  async findOneBy(@Param('id') id: string): Promise<TaskHistory> {
    return await this.taskHistoryService.findOneBy(id);
  }

  @Post()
  async create(@Body() task: TaskHistory): Promise<TaskHistory> {
    return await this.taskHistoryService.create(task);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() task: TaskHistory): Promise<TaskHistory> {
    return await this.taskHistoryService.update(id, task);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.taskHistoryService.remove(id);
  }
}
