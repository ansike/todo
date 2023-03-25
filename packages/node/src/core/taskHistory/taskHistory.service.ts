import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userKeys } from '../user/user.service';
import { TaskHistory } from './taskHistory.entity';

const logger = new Logger('TaskHistoryService');

@Injectable()
export class TaskHistoryService {
  constructor(
    @InjectRepository(TaskHistory)
    private taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async findAndCountAll(
    taskId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: TaskHistory[];
    count: number;
    page: number;
    limit: number;
  }> {
    const [data, count] = await this.taskHistoryRepository
      .createQueryBuilder('taskHistory')
      .select([
        'taskHistory.id',
        'taskHistory.task_id',
        'taskHistory.operator_id',
        'taskHistory.operation',
        'taskHistory.result',
        'taskHistory.operation_time',
        ...userKeys.map((k) => `operate_user.${k}`),
      ])
      .leftJoin('taskHistory.operate_user', 'operate_user')
      .orderBy('taskHistory.operation_time', 'DESC')
      .where('taskHistory.task_id = :taskId', { taskId })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, count, page, limit };
  }

  async findOneBy(id: string): Promise<TaskHistory> {
    return await this.taskHistoryRepository.findOneBy({ id });
  }

  async create(
    task: Omit<TaskHistory, 'id' | 'operate_user'>,
  ): Promise<TaskHistory> {
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
