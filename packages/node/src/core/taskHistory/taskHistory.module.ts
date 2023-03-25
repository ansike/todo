import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskHistoryController } from './taskHistory.controller';
import { TaskHistoryService } from './taskHistory.service';
import { TaskHistory } from './taskHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskHistory])],
  controllers: [TaskHistoryController],
  providers: [TaskHistoryService],
  exports: [TaskHistoryService],
})
export class TaskHistoryModule {}
