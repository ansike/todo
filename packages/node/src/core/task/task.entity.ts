import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  creator_id: string;

  @Column({ nullable: true })
  assignee_id: string;

  @Column()
  plan_finish_time: Date;

  @Column({ default: new Date('1970-01-01 00:00:01') })
  actual_finish_time: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
