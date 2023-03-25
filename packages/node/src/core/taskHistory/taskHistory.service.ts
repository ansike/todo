import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from './taskHistory.entity';

const logger = new Logger('TaskHistoryService');

@Injectable()
export class TaskHistoryService {
  constructor(
    @InjectRepository(TaskHistory)
    private taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async findAndCountAll(
    page: number,
    limit: number,
  ): Promise<{ data: TaskHistory[]; count: number }> {
    const [data, count] = await this.taskHistoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, count };
  }

  async findOneBy(id: string): Promise<TaskHistory> {
    return await this.taskHistoryRepository.findOneBy({ id });
  }

  async create(task: Omit<TaskHistory, 'id'>): Promise<TaskHistory> {
    logger.log(`task: ${JSON.stringify(task)}`);
    return await this.taskHistoryRepository.save(task);
  }

  async update(id: string, task: TaskHistory): Promise<TaskHistory> {
    await this.taskHistoryRepository.update(id, task);
    return await this.taskHistoryRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.taskHistoryRepository.delete(id);
  }
}
