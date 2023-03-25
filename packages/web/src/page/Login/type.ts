/*
 * @Description: description
 * @Author: Ask
 * @LastEditors: Ask
 * @Date: 2023-03-07 22:40:45
 * @LastEditTime: 2023-03-09 23:57:28
 */
export type GroupType = {
  _id: string;
  name: string;
  member: UserType[];
  avatar: "";
  created_at: string;
  update_at: string;
};

export type MsgType = {
  _id: string;
  msg: string;
  user: UserType;
  group: GroupType;
  created_at?: string;
  update_at?: string;
};

export type UserType = {
  _id: string;
  name: string;
  age: number;
  avatar: "";
  created_at: string;
  update_at: string;
};
