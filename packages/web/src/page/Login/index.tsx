// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { request } from "@/utils/fetch";
import { Form, Input, Button, Checkbox } from "@arco-design/web-react";
import { useNavigate } from "react-router";
import { request } from "../../utils/fetch";
import s from "./index.module.less";

const FormItem = Form.Item;

const Login = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const submit = async (vals: any) => {
    const user = await request("/api/auth/login", {
      method: "post",
      data: vals,
    });
    console.log(user);
    if (user) {
      navigate("/todo");
    }
  };
  return (
    <div className={s.login}>
      <Form className={s.form} autoComplete="off" onSubmit={submit}>
        <FormItem label="用户名" rules={[{ required: true }]} field="username">
          <Input placeholder="please enter your username" />
        </FormItem>
        <FormItem label="密码" rules={[{ required: true }]} field="password">
          <Input placeholder="please enter your password" />
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default Login;
