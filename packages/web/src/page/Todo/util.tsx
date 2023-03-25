import { OPERATION_TYPE, TaskHistoryType } from "./type";
import s from "./index.module.less";
import { formatDateToRead } from "../../utils/format";

// 计算历史记录
export const calcResult = (taskHistory: TaskHistoryType) => {
  const { operation, operate_user, result } = taskHistory;
  switch (+operation) {
    case OPERATION_TYPE.CREATE:
      return <span>创建了任务</span>;
    case OPERATION_TYPE.ADD_MEMBER:
      return (
        <span>
          添加了关注人
          <span className={s.operator}>{operate_user?.username}</span>
        </span>
      );
    case OPERATION_TYPE.UPDATE_TITLE:
      return <span>更新任务标题为 {result}</span>;
    case OPERATION_TYPE.UPDATE_DESCRIPTION:
      return <span>更新任务描述为 {result}</span>;
    case OPERATION_TYPE.UPDATE_PLAN_FINISH_TIME:
      return <span>添加了截止时间 {formatDateToRead(result)}</span>;
    case OPERATION_TYPE.DONE:
      return <span>完成了任务</span>;
    case OPERATION_TYPE.RESTART:
      return <span>重启了任务</span>;
  }
  return "";
};
