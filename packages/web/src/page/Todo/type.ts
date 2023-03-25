export type TaskType = {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  assignee_id: string;
  plan_finish_time: Date;
  actual_finish_time: Date;
  create_time: Date;
};
