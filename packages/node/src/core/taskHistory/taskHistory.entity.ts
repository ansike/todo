import { OPERATION_TYPE } from 'src/contant/const';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'task_id', type: 'char', length: 36 })
  task_id: string;

  @Column({ name: 'operator_id', type: 'char', length: 36 })
  operator_id: string;

  @Column({ type: 'varchar', length: 50 })
  operation: OPERATION_TYPE;

  @Column({ type: 'text', nullable: true })
  result: string;

  @Column({
    name: 'operation_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  operationTime: Date;
  
  constructor(partial: Partial<TaskHistory>) {
    Object.assign(this, partial);
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
