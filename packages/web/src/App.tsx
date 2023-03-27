import { useEffect } from "react";
import "./App.css";
import { request } from "./utils/fetch";
import SelfRouter from "./router";
import CheckLogin from "./components/CheckLogin";
import { Button } from "@arco-design/web-react";

function App() {
  useEffect(() => {
    // getData();
  }, []);

  const getData = async () => {
    const res = await request("/api/test");
    console.log(res);
  };

  return (
    <CheckLogin>
      <SelfRouter />
    </CheckLogin>
  );
}

export default App;
