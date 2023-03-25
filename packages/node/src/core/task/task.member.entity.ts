import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class TaskMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  task_id: string;

  @Column({ length: 36 })
  member_id: string;

  constructor(partial: Partial<TaskMember>) {
    Object.assign(this, partial);
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
