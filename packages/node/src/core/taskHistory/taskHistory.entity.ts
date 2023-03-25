import { OPERATION_TYPE } from 'src/contant/const';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.entity';

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
  operation_time: Date;
  
  @ManyToOne(() => User, user => user.task_histories, { eager: true })
  @JoinColumn({ name: 'operator_id', referencedColumnName: 'id'})
  operate_user: User;

  constructor(partial: Partial<TaskHistory>) {
    Object.assign(this, partial);
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
