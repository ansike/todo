import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  Input,
  Form,
  FormInstance,
} from "@arco-design/web-react";
import { DATA_INDEX_OPERATION } from "./type";
const FormItem = Form.Item;
const EditableContext = React.createContext<{
  getForm?: () => FormInstance | null;
}>({});

export function EditableRow(props: any) {
  const { children, record, className, ...rest } = props;
  const refForm =
    useRef<FormInstance<any, any, string | number | symbol>>(null);

  const getForm = () => refForm.current;

  return (
    <EditableContext.Provider
      value={{
        getForm,
      }}
    >
      <Form
        style={{ display: "table-row" }}
        children={children}
        ref={refForm}
        wrapper="tr"
        wrapperProps={rest}
        className={`${className} editable-row`}
      />
    </EditableContext.Provider>
  );
}

export function EditableCell(props: any) {
  const { children, className, rowData, column, onHandleSave } = props;
  const ref = useRef(null);
  const refInput = useRef(null);
  const { getForm } = useContext(EditableContext);
  const [editing, setEditing] = useState(
    column.editable && rowData[column.dataIndex] === "" && true
  );
  const handleClick = useCallback(
    (e: any) => {
      if (
        editing &&
        column.editable &&
        ref.current &&
        !(ref.current as any).contains(e.target) &&
        !e.target.classList.contains("js-demo-select-option")
      ) {
        cellValueChangeHandler();
      }
    },
    [editing, rowData, column]
  );

  useEffect(() => {
    editing && refInput.current && (refInput.current as any).focus();
  }, [editing]);

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [handleClick]);

  const cellValueChangeHandler = () => {
    const form = getForm?.();
    const value = form?.getFieldValue(column.dataIndex);

    setEditing(false);
    if (value && value === rowData[column.dataIndex]) {
      return;
    }
    onHandleSave &&
      onHandleSave(
        {
          ...rowData,
          [column.dataIndex]: value,
        },
        DATA_INDEX_OPERATION[column.dataIndex]
      );
  };

  if (editing) {
    return (
      <div ref={ref}>
        {column.dataIndex === "title" ? (
          <FormItem
            style={{ marginBottom: 0 }}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            initialValue={rowData[column.dataIndex]}
            field={column.dataIndex}
            rules={[{ required: true }]}
          >
            <Input ref={refInput} onPressEnter={cellValueChangeHandler} />
          </FormItem>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={column.editable ? `editable-cell ${className}` : className}
      onClick={() => column.editable && setEditing(true)}
    >
      {children}
    </div>
  );
}
