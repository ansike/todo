import { Inject, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OPERATION_TYPE, TASK_STATUS } from 'src/contant/const';
import { Repository } from 'typeorm';
import { TaskHistoryService } from '../taskHistory/taskHistory.service';
import { User } from '../user/user.entity';
import { userKeys } from '../user/user.service';
import { Task } from './task.entity';
import { TaskMember } from './task.member.entity';

const defaultTime = new Date('1970-01-01T00:00:01Z');

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
    @Req() req,
  ): Promise<{ data: Task[]; count: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      creator_id,
      assignee_id,
      create_time,
      plan_finish_time,
      actual_finish_time,
      status = TASK_STATUS.created,
    } = req.query;

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .select([
        'task.id',
        'task.title',
        'task.description',
        'task.creator_id',
        'task.assignee_id',
        'task.plan_finish_time',
        'task.actual_finish_time',
        'task.create_time',
        'task.status',
        ...userKeys.map((k) => `createUser.${k}`),
      ])
      .addSelect(userKeys.map((k) => `assigneeUser.${k}`))
      .leftJoin('task.createUser', 'createUser')
      .leftJoin('task.assigneeUser', 'assigneeUser');

    // 非全部任务时执行where查询
    if (status !== 'all') {
      queryBuilder.andWhere('task.status = :status ', {
        status,
      });
    }
    if (creator_id) {
      queryBuilder.andWhere('task.creator_id = :creatorId ', {
        creatorId: creator_id,
      });
    }
    if (assignee_id) {
      queryBuilder.andWhere('task.assignee_id = :assigneeId', {
        assigneeId: assignee_id,
      });
    }
    if (create_time) {
      queryBuilder.addOrderBy('task.create_time', create_time);
    }
    if (plan_finish_time) {
      queryBuilder.addOrderBy('task.plan_finish_time', plan_finish_time);
    }
    if (actual_finish_time) {
      queryBuilder.addOrderBy('task.actual_finish_time', actual_finish_time);
    }
    const [data, count] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // 这个时间处理有点丑陋
    const result = data.map((task) => {
      if (
        task.plan_finish_time &&
        task.plan_finish_time.getTime() === defaultTime.getTime()
      ) {
        task.plan_finish_time = null;
      }
      if (
        task.actual_finish_time &&
        task.actual_finish_time.getTime() === defaultTime.getTime()
      ) {
        task.actual_finish_time = null;
      }
      return task;
    });
    return { data: result, count, page, limit };
  }

  async findOneBy(id: string): Promise<Task> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .select([
        'task.id',
        'task.title',
        'task.description',
        'task.creator_id',
        'task.assignee_id',
        'task.plan_finish_time',
        'task.actual_finish_time',
        'task.create_time',
        'task.status',
        ...userKeys.map((k) => `createUser.${k}`),
      ])
      .addSelect(userKeys.map((k) => `assigneeUser.${k}`))
      .leftJoin('task.createUser', 'createUser')
      .leftJoin('task.assigneeUser', 'assigneeUser')
      .where('task.id = :taskId', { taskId: id })
      .getOne();
  }

  async create(session, task: Task): Promise<Task> {
    const { user } = session;
    const newTask = await this.taskRepository.save({
      ...task,
      creator_id: user.id,
      assignee_id: user.id,
    });

    // 创建任务历史
    await this.taskHistoryService.create({
      task_id: newTask.id,
      operator_id: user.id,
      operation: OPERATION_TYPE.CREATE,
      result: '创建一个任务',
      operation_time: new Date(),
    });

    await this.taskMemberRepository.save({
      task_id: newTask.id,
      member_id: user.id,
    });

    await this.taskHistoryService.create({
      task_id: newTask.id,
      operator_id: user.id,
      operation: OPERATION_TYPE.ADD_MEMBER,
      result: user.id,
      operation_time: new Date(),
    });

    return newTask;
  }

  async update(
    session,
    id: string,
    task: Task & { operationType: OPERATION_TYPE },
  ): Promise<Task> {
    if (task.operationType === undefined) {
      throw '更新task必须声明操作类型 operationType';
    }
    const { user } = session;
    const res = await this.calcResult(user, id, task.operationType, task);
    console.log(res);

    const c = await this.taskHistoryService.create({
      task_id: id,
      operator_id: user.id,
      operation: task.operationType,
      result: res,
      operation_time: new Date(),
    });
    console.log(c);
    return await this.taskRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  async calcResult(user: User, id: string, type: OPERATION_TYPE, task: Task) {
    switch (type) {
      case OPERATION_TYPE.ADD_MEMBER:
        this.taskMemberRepository.create({
          task_id: id,
          member_id: user.id,
        });
        return user.id;
      case OPERATION_TYPE.UPDATE_ASSIGNEE_USER:
        if (!task.assignee_id)
          throw `${OPERATION_TYPE.UPDATE_ASSIGNEE_USER} 缺少 assignee_id`;
        await this.taskRepository.update(id, { assignee_id: task.assignee_id });
        return task.assignee_id;
      case OPERATION_TYPE.UPDATE_TITLE:
        if (!task.title) throw `${OPERATION_TYPE.UPDATE_TITLE} 缺少 title`;
        await this.taskRepository.update(id, { title: task.title });
        return task.title;
      case OPERATION_TYPE.UPDATE_DESCRIPTION:
        if (!task.description)
          throw `${OPERATION_TYPE.UPDATE_DESCRIPTION} 缺少 description`;
        await this.taskRepository.update(id, { description: task.description });
        return task.description;
      case OPERATION_TYPE.UPDATE_PLAN_FINISH_TIME:
        if (!task.plan_finish_time)
          throw `${OPERATION_TYPE.UPDATE_PLAN_FINISH_TIME} 缺少 plan_finish_time`;
        await this.taskRepository.update(id, {
          plan_finish_time: task.plan_finish_time,
        });
        return task.plan_finish_time + '';
      case OPERATION_TYPE.DONE:
        await this.taskRepository.update(id, {
          status: TASK_STATUS.done,
        });
        return '';
      case OPERATION_TYPE.RESTART:
        await this.taskRepository.update(id, {
          status: TASK_STATUS.restart,
        });
        return '';
      default:
        break;
    }
    return '';
  }
}
