import { Form, Input, Button } from "@arco-design/web-react";
import { useNavigate } from "react-router";
import { UserType } from "../../components/CheckLogin/type";
import { request } from "../../utils/fetch";
import s from "./index.module.less";

const FormItem = Form.Item;

const Login = () => {
  const navigate = useNavigate();
  const submit = async (vals: any) => {
    const user = await request<UserType>("/api/auth/login", {
      method: "post",
      data: vals,
    });
    if (user?.id) {
      navigate("/");
    }
  };
  return (
    <div className={s.login}>
      <Form className={s.form} autoComplete="off" onSubmit={submit}>
        <FormItem label="用户名" rules={[{ required: true }]} field="username">
          <Input placeholder="请输入用户名" />
        </FormItem>
        <FormItem label="密码" rules={[{ required: true }]} field="password">
          <Input placeholder="请输入密码 " />
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
