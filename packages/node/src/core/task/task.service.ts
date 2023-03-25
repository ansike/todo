import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OPERATION_TYPE } from 'src/contant/const';
import { Repository } from 'typeorm';
import { TaskHistoryService } from '../taskHistory/taskHistory.service';
import { Task } from './task.entity';
import { TaskMember } from './task.member.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskMember)
    private taskMemberRepository: Repository<TaskMember>,
    @Inject(TaskHistoryService)
    private readonly taskHistoryService: TaskHistoryService,
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

  async create(session, task: Task): Promise<Task> {
    const newTask = await this.taskRepository.save(task);
    const { user } = session;
    this.taskHistoryService.create({
      task_id: newTask.id,
      operator_id: user.id,
      operation: OPERATION_TYPE.CREATE,
      result: '创建一个任务',
      operationTime: new Date(),
    });
    return newTask;
  }

  async update(
    id: string,
    task: Task & { updateType: OPERATION_TYPE },
  ): Promise<Task> {
    const res = await this.calcResult(id, task.updateType, task);
    this.taskHistoryService.create({
      task_id: id,
      operator_id: id,
      operation: task.updateType,
      result: res,
      operationTime: new Date(),
    });
    return await this.taskRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  async calcResult(id: string, type: OPERATION_TYPE, task: Task) {
    switch (type) {
      case OPERATION_TYPE.ADD_MEMBER:
        this.taskMemberRepository.create({
          task_id: id,
          member_id: id, //TODO uid
        });
        break;
      case OPERATION_TYPE.UPDATE_ASSIGNEE_USER:
        if (!task.assignee_id)
          throw `${OPERATION_TYPE.UPDATE_ASSIGNEE_USER} 缺少 assignee_id`;
        await this.taskRepository.update(id, { assignee_id: task.assignee_id });
        return;
      case OPERATION_TYPE.UPDATE_TITLE:
        if (!task.title) throw `${OPERATION_TYPE.UPDATE_TITLE} 缺少 title`;
        await this.taskRepository.update(id, { title: task.title });
        break;
      case OPERATION_TYPE.UPDATE_DESCRIPTION:
        if (!task.description)
          throw `${OPERATION_TYPE.UPDATE_DESCRIPTION} 缺少 description`;
        await this.taskRepository.update(id, { description: task.description });
        break;
      case OPERATION_TYPE.UPDATE_PLAN_FINISH_TIME:
        if (!task.plan_finish_time)
          throw `${OPERATION_TYPE.UPDATE_PLAN_FINISH_TIME} 缺少 plan_finish_time`;
        await this.taskRepository.update(id, {
          plan_finish_time: task.plan_finish_time,
        });
        break;
      default:
        break;
    }
    return '';
  }
}
