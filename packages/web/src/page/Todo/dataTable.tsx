import {
  Table,
  TableColumnProps,
  Button,
  Message,
  DatePicker,
  Space,
  Select,
} from "@arco-design/web-react";
import {
  OPERATION_TYPE,
  TaskQuery,
  TaskType,
  TASK_STATUS,
  TASK_STATUS_MAP,
} from "./type";
import { IconCloseCircle, IconPlus } from "@arco-design/web-react/icon";
import s from "./index.module.less";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/CheckLogin/context";
import { formatDateToRead } from "../../utils/format";
import { EditableCell, EditableRow } from "./dataItem";
import { request } from "../../utils/fetch";
import dayjs from "dayjs";
import { UserType } from "../../components/CheckLogin/type";
import DetailDrawer from "./detailDrawer";
import { useAsync } from "react-use";

const Option = Select.Option;
interface TaskTableType {
  total: number;
  data: TaskType[];
  refresh: (q: TaskQuery) => void;
}

interface UserListType {
  count: number;
  data: UserType[];
}

const TaskTable: React.FC<TaskTableType> = ({ total, data, refresh }) => {
  const [tasks, setTasks] = useState<Partial<TaskType>[]>([]);
  const [taskId, setTaskId] = useState<string>("");
  const [createUser, setCreateUser] = useState<string>();
  const [assignUser, setAssignUser] = useState<string>();
  const [status, setStatus] = useState<string>(TASK_STATUS.created);
  const [queryObj, setQueryObj] = useState<TaskQuery>({
    page: 1,
    limit: 10,
  });
  const { user } = useContext(UserContext);
  const { value: userRes } = useAsync<() => Promise<UserListType>>(async () => {
    return await request<UserListType>("/api/user");
  });

  useEffect(() => {}, [user]);

  useEffect(() => {
    setTasks(data);
  }, [data]);

  const addRow = () => {
    if (tasks[0] && !tasks[0].title) return;
    setTasks([
      {
        title: "",
        create_time: dayjs().toDate(),
        id: "",
      },
      ...tasks,
    ]);
  };

  const handleSave = async (
    row: Partial<TaskType & { __ORIGIN_DATA: any }>,
    operationType: OPERATION_TYPE
  ) => {
    const newData = [...tasks];
    delete row?.__ORIGIN_DATA;
    if (!row.title) {
      setTasks(newData.slice(1));
    } else {
      if (!row.id) {
        await createTask(row as UserType);
      } else {
        await updateTask(operationType, row as TaskType);
      }
    }
  };

  const changeTime = (dateString: string, row: TaskType) => {
    row.plan_finish_time = dateString;
    updateTask(OPERATION_TYPE.UPDATE_PLAN_FINISH_TIME, row);
  };

  const openDrawer = (row: TaskType) => {
    setTaskId(row.id);
  };
  const createTask = async (row: Partial<TaskType>) => {
    delete row?.id;
    const res = await request<TaskType>("/api/task", {
      method: "post",
      data: row,
    });
    if (res?.id) {
      Message.success("创建成功");
      refresh(queryObj);
    }
  };

  const updateTask = async (
    operationType: OPERATION_TYPE,
    row: TaskType,
    toast = "编辑成功"
  ) => {
    const res = await request<TaskType>(`/api/task/${row.id}`, {
      method: "put",
      data: {
        ...row,
        operationType,
      },
    });
    if (res?.id && toast) {
      Message.success(toast);
      refresh(queryObj);
    }
  };

  const columns: TableColumnProps[] = [
    {
      title: "任务标题",
      dataIndex: "title",
      editable: true,
    },
    {
      title: "截止时间",
      dataIndex: "plan_finish_time",
      render(time, row) {
        return time ? (
          formatDateToRead(time)
        ) : (
          <Space>
            <DatePicker
              triggerElement={
                <Button icon={<IconCloseCircle />}>{time}</Button>
              }
              showTime={{
                defaultValue: "04:05:06",
              }}
              format="YYYY-MM-DD HH:mm:ss"
              onOk={(dateString: string) => changeTime(dateString, row)}
            />
          </Space>
        );
      },
    },
    {
      title: "创建人",
      dataIndex: "createUser",
      render(createUser, row) {
        return (
          <div style={{ cursor: "pointer" }} onClick={() => openDrawer(row)}>
            {createUser?.username}
          </div>
        );
      },
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.create_time - b.create_time,
      render(time, row) {
        return (
          <div style={{ cursor: "pointer" }} onClick={() => openDrawer(row)}>
            {formatDateToRead(time)}
          </div>
        );
      },
    },
    {
      title: "任务ID",
      dataIndex: "id",
      render(id, row) {
        return (
          <div style={{ cursor: "pointer" }} onClick={() => openDrawer(row)}>
            {id}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className={s.header}>
        <div className={s.left}>
          <Button type="outline" size="mini" onClick={addRow}>
            <IconPlus />
            新建任务
          </Button>
        </div>
        <div className={s.right}>
          <div className={s.filterItem}>
            任务状态：
            <Select
              value={status}
              placeholder="选择任务状态"
              size="small"
              style={{ width: 154 }}
              allowClear
              onChange={(val) => {
                setStatus(val);
                const newQuery = {
                  ...queryObj,
                  status: val || TASK_STATUS.created,
                };
                setQueryObj(newQuery);
                refresh(newQuery);
              }}
            >
              {TASK_STATUS_MAP.map((status) => {
                const { label, value } = status;
                return (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div className={s.filterItem}>
            创建人：
            <Select
              value={createUser}
              placeholder="选择用户"
              size="small"
              style={{ width: 154 }}
              allowClear
              onChange={(val) => {
                setCreateUser(val);
                const newQuery = {
                  ...queryObj,
                  creator_id: val || "",
                };
                setQueryObj(newQuery);
                refresh(newQuery);
              }}
            >
              {userRes?.data.map((user) => {
                const { id, username } = user;
                return (
                  <Option key={id} value={id}>
                    {username}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div className={s.filterItem}>
            负责人：
            <Select
              value={assignUser}
              placeholder="选择用户"
              size="small"
              style={{ width: 154 }}
              allowClear
              onChange={(val) => {
                setAssignUser(val);
                const newQuery = {
                  ...queryObj,
                  assignee_id: val || "",
                };
                setQueryObj(newQuery);
                refresh(newQuery);
              }}
            >
              {userRes?.data.map((user) => {
                const { id, username } = user;
                return (
                  <Option key={id} value={id}>
                    {username}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
      </div>
      <Table
        rowKey="id"
        className={s.table}
        pagination={{
          current: queryObj.page,
          pageSize: queryObj.limit,
          total,
        }}
        onChange={(pagination, sorter, filters) => {
          console.log(pagination, sorter, filters);
          const newQuery = {
            ...queryObj,
            [sorter.field as string]:
              sorter.direction === "ascend" ? "ASC" : "DESC",
          };
          setQueryObj(newQuery);
          refresh(newQuery);
        }}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        columns={
          columns.map((column) =>
            column.editable
              ? {
                  ...column,
                  onCell: () => ({
                    onHandleSave: handleSave,
                  }),
                }
              : column
          ) as any
        }
        data={tasks}
        rowSelection={{
          type: "checkbox",
          checkAll: false,
          onSelect: async (_, record) => {
            await updateTask(
              OPERATION_TYPE.DONE,
              record as TaskType,
              "完成任务"
            );
            await refresh(queryObj);
          },
          checkboxProps: (record) => {
            return {
              disabled: record.status === TASK_STATUS.done,
            };
          },
        }}
      />
      {taskId && (
        <DetailDrawer
          taskId={taskId}
          close={() => {
            setTaskId("");
            refresh(queryObj);
          }}
        />
      )}
    </>
  );
};

export default TaskTable;
