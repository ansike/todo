import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

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
  plan_finish_time: Date = new Date(0);
  
  @Column()
  status: string;

  @Column()
  actual_finish_time: Date = new Date(0);

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @ManyToOne(() => User, user => user.tasks, { eager: true })
  @JoinColumn({ name: 'creator_id', referencedColumnName: 'id'})
  createUser: User;

  @ManyToOne(() => User, user => user.tasks, { eager: true })
  @JoinColumn({ name: 'assignee_id' })
  assigneeUser: User;
}
