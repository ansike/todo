import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAndCountAll(
    page: number,
    limit: number,
  ): Promise<{ data: Task[]; count: number }> {
    const [data, count] = await this.taskRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, count };
  }

  async findOneBy(id: string): Promise<Task> {
    return await this.taskRepository.findOneBy({ id });
  }

  async create(task: Task): Promise<Task> {
    return await this.taskRepository.save(task);
  }

  async update(id: string, task: Task): Promise<Task> {
    await this.taskRepository.update(id, task);
    return await this.taskRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
