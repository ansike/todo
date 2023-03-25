import { Drawer, Steps } from "@arco-design/web-react";
import { IconLeft } from "@arco-design/web-react/icon";
import { useCallback, useEffect, useState } from "react";
import { useAsync, useAsyncFn } from "react-use";
import { request } from "../../utils/fetch";
import { formatDateToRead } from "../../utils/format";
import s from "./index.module.less";
import { TaskHistoryType } from "./type";
import { calcResult } from "./util";

const Step = Steps.Step;
interface HistoryDrawerType {
  taskId: string;
  visible: boolean;
  close: () => void;
}
const HistoryDrawer: React.FC<HistoryDrawerType> = ({
  taskId,
  visible,
  close,
}) => {
  const { loading, value } = useAsync<
    () => Promise<{ data: TaskHistoryType[] }>
  >(async () => {
    return request(`/api/taskHistory/${taskId}`, { data: { limit: 1000 } });
  });

  return (
    <>
      <Drawer
        className={s.historyDrawer}
        width={500}
        closable={false}
        title={
          <div className={s.title}>
            <div className={s.id}><IconLeft onClick={close} className={s.back} />ID: {taskId}</div>
            <div className={s.handle}></div>
          </div>
        }
        visible={visible}
        onCancel={close}
      >
        <div>
          <Steps
            type="dot"
            direction="vertical"
            current={value?.data.length}
            style={{ maxWidth: 780 }}
          >
            {value?.data?.map((th) => {
              const { id, operation_time, operate_user } =
                th;
              return (
                <Step
                  key={id}
                  title={<div className={s.historyTitle}>{formatDateToRead(operation_time)}</div>}
                  description={
                    <div className={s.description}>
                      <span className={s.operator}>
                        {operate_user?.username}
                      </span>
                      {calcResult(th)}
                    </div>
                  }
                />
              );
            })}
          </Steps>
        </div>
      </Drawer>
    </>
  );
};

export default HistoryDrawer;
