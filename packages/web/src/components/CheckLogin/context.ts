import { createContext } from "react";
import { UserType } from "./type";

export const UserContext = createContext<{
  user: UserType | undefined;
}>({
  user: undefined,
});
