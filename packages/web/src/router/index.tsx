import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../page/Login";
import Todo from "../page/Todo";

const routes = [
  {
    path: "/",
    // element: <Container />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/todo",
        element: <Todo />,
      },
      {
        // 默认路由
        path: "",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);
const SelfRouter = () => {
  return <RouterProvider router={router} />;
};

export default SelfRouter;
