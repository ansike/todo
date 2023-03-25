import { UserType } from "../../components/CheckLogin/type";



export type TaskType = {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  assignee_id: string;
  plan_finish_time: string | null; // 创建时可能不存在
  actual_finish_time: string;
  create_time: Date | string;
  createUser?: UserType;
  assigneeUser?: UserType;
};

export type TaskHistoryType = {
  id: string;
  operation: string;
  operator_id: string;
  result: string;
  task_id: string;
  operation_time: string;
  operate_user: UserType;
};
// 任务操作类型
export enum OPERATION_TYPE {
  CREATE,
  DELETE,
  ADD_MEMBER, // 添加成员
  UPDATE_TITLE,
  UPDATE_DESCRIPTION,
  UPDATE_ASSIGNEE_USER, // 更新负责人
  UPDATE_PLAN_FINISH_TIME, // 计划完成时间
  DONE,
  RESTART,
}

export const DATA_INDEX_OPERATION: { [k: string]: OPERATION_TYPE } = {
  title: OPERATION_TYPE.UPDATE_TITLE,
  description: OPERATION_TYPE.UPDATE_DESCRIPTION,
  member: OPERATION_TYPE.ADD_MEMBER,
  plan_finish_time: OPERATION_TYPE.UPDATE_PLAN_FINISH_TIME,
};

export type TaskQuery = {
  page?: number;
  limit?: number;
  creator_id?: string;
  assignee_id?: string;
  create_time?: "ASC" | "DESC";
  plan_finish_time?: "ASC" | "DESC";
  actual_finish_time?: "ASC" | "DESC";
};