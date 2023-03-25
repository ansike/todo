import { useEffect } from "react";
import { useAsyncFn } from "react-use";
import { TaskQuery, TaskType } from "./type";
import TaskTable from "./dataTable";
import { request } from "../../utils/fetch";
import s from "./index.module.less";

const Todo = () => {
  const [state, fetch] = useAsyncFn<
    (query?: TaskQuery) => Promise<{ count: number; data: TaskType[] }>
  >(async (query) => {
    return await request("/api/task", { data: query });
  });

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className={s.task}>
      <TaskTable
        total={state.value?.count || 0}
        data={state.value?.data || []}
        refresh={(query) => fetch(query)}
      />
    </div>
  );
};

export default Todo;
