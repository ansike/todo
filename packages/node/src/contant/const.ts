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

// 任务的状态
export const TASK_STATUS = {
  created: 'created',
  closed: 'closed',
  done: 'done',
};
