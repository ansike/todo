import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../task/task.entity';
import { TaskHistory } from '../taskHistory/taskHistory.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 50 })
  nickname: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 50 })
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Task, task => task.createUser)
  @JoinColumn({ name: 'creator_id' })
  tasks: Task[];

  @OneToMany(() => TaskHistory, task => task.operate_user)
  @JoinColumn({ name: 'operator_id' })
  task_histories: TaskHistory[];

  @BeforeInsert()
  generateUUID() {
    this.id = uuidv4();
  }
}
