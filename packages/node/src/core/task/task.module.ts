import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { TaskHistoryModule } from '../taskHistory/taskHistory.module';
import { TaskMember } from './task.member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskMember]), TaskHistoryModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
