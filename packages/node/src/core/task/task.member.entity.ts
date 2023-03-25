import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  task_id: string;

  @Column({ length: 36 })
  member_id: string;
}
