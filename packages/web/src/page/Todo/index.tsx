import { Button, Table, TableColumnProps } from "@arco-design/web-react";
import { IconPlus } from '@arco-design/web-react/icon';
import { useContext } from "react";
import { useAsync } from "react-use";
import { UserContext } from "../../components/CheckLogin/context";
import { request } from "../../utils/fetch";
import { TaskType } from "./type";
import s from "./index.module.less";

const Todo = () => {
  const { user } = useContext(UserContext);
  const { loading, value } = useAsync<
    () => Promise<{ count: number; data: TaskType[] }>
  >(async () => {
    return await request("/api/task");
  });
  console.log(value);

  const columns: TableColumnProps[] = [
    {
      title: "任务标题",
      dataIndex: "title",
    },
    {
      title: "截止时间",
      dataIndex: "plan_finish_time",
    },
    {
      title: "创建人",
      dataIndex: "creator_id",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
    },
    {
      title: "任务ID",
      dataIndex: "id",
    },
  ];

  return <div className={s.task}>
    <Button type='outline' size="mini"><IconPlus />新建任务</Button><br /><br />
    <Table className={s.table} loading={loading} columns={columns} data={value?.data} />
  </div>;
};

export default Todo;
