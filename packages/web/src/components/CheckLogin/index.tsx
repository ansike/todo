import React, { ReactNode } from "react";
import { Spin } from "@arco-design/web-react";
import { useAsync } from "react-use";
import { request } from "../../utils/fetch";
import { UserContext } from "./context";
import { UserType } from "./type";

interface Props {
  children: ReactNode;
}

const CheckLogin: React.FC<Props> = ({ children }) => {
  const { loading, value } = useAsync<() => Promise<UserType>>(
    async () => await request("/api/auth/checkLogin")
  );

  // 除登录页面外都需要loading等待以上接口调用完
  if (loading) {
    return (
      <Spin
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
        }}
      />
    );
  } else if (!value?.id && !window.location.pathname.includes("login")) {
    window.location.href = "/login";
  }

  return (
    <UserContext.Provider value={{ user: value }}>
      {children}
    </UserContext.Provider>
  );
};

export default CheckLogin;
