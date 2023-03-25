import {
  Checkbox,
  Drawer,
  Dropdown,
  Input,
  Menu,
  Message,
  Modal,
  Tooltip,
} from "@arco-design/web-react";
import {
  IconClose,
  IconDelete,
  IconExclamationCircle,
  IconHistory,
  IconMore,
  IconShareInternal,
  IconSort,
  IconSubscribeAdd,
  IconUser,
} from "@arco-design/web-react/icon";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useAsync, useAsyncFn } from "react-use";
import { request } from "../../utils/fetch";
import HistoryDrawer from "./historyDrawer";
import s from "./index.module.less";
import { OPERATION_TYPE, TaskType } from "./type";

interface DetailDrawerType {
  taskId: string;
  close: () => void;
}
const DetailDrawer: React.FC<DetailDrawerType> = ({ close, taskId }) => {
  const [description, setDescription] = useState("");
  const [historyVisible, setHistoryVisible] = useState(false);

  const { value } = useAsync<() => Promise<TaskType>>(async () => {
    return request(`/api/task/${taskId}`);
  });

  const [_, deleteFn] = useAsyncFn<() => Promise<unknown>>(async () => {
    return request(`/api/task/${taskId}`, { method: "delete" });
  });

  useEffect(() => {
    setDescription(value?.description || "");
  }, [value]);

  const change = useCallback(
    debounce(async (v: string) => {
      await request(`/api/task/${taskId}`, {
        method: "put",
        data: {
          description: v,
          operationType: OPERATION_TYPE.UPDATE_DESCRIPTION,
        },
      });
    }, 1000),
    [taskId]
  );

  const dropList = (
    <Menu>
      <Menu.Item key="1" onClick={() => setHistoryVisible(true)}>
        <IconHistory />
        &nbsp; 查看历史记录
      </Menu.Item>
      <Menu.Item key="2">
        <IconExclamationCircle />
        &nbsp; 举报
      </Menu.Item>
      <Menu.Item
        key="3"
        style={{ color: "red" }}
        onClick={() => {
          Modal.confirm({
            title: `删除任务“${value?.title}”？`,
            okButtonProps: {
              status: "danger",
            },
            onOk: () => {
              return new Promise((resolve, reject) => {
                deleteFn().then((res) => {
                  close();
                  Message.success({
                    content: "已删除",
                  });
                  resolve(res);
                }).catch(()=>{
                  reject();
                });
              }).catch((e) => {
                Message.error({
                  content: "Error occurs!",
                });
                throw e;
              });
            },
          });
        }}
      >
        <IconDelete />
        &nbsp; 删除
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Drawer
        className={s.drawer}
        width={500}
        closable={false}
        title={
          <div className={s.title}>
            <div className={s.id}>ID: {taskId}</div>
            <div className={s.handle}>
              <IconSubscribeAdd className={s.handleItem} />
              <IconShareInternal className={s.handleItem} />
              <Dropdown droplist={dropList} trigger="click" position="bl">
                <IconMore className={s.handleItem} />
              </Dropdown>
              <Tooltip content="关闭">
                <IconClose className={s.handleItem} onClick={close} />
              </Tooltip>
            </div>
          </div>
        }
        visible={!!taskId}
        onOk={close}
        onCancel={close}
      >
        <div>
          <div className={`${s.detailItem} ${s.title}`}>
            <Checkbox>{value?.title}</Checkbox>
          </div>
          <div className={`${s.detailItem} ${s.description}`}>
            <IconSort className={s.detailLeft} />
            <Input
              className={s.ipt}
              value={description}
              onChange={(v) => {
                setDescription(v);
                change(v);
              }}
              placeholder="添加描述"
            />
          </div>
          <div className={`${s.detailItem} ${s.user}`}>
            <IconUser className={s.detailLeft} />
            {value?.assigneeUser?.username}
          </div>
        </div>
      </Drawer>
      {historyVisible && (
        <HistoryDrawer taskId={taskId} visible={historyVisible} close={()=>setHistoryVisible(false)} />
      )}
    </>
  );
};

export default DetailDrawer;
