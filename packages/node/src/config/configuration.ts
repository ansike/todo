import { SessionOptions } from "src/middleware/session.middlreware";

export interface IAuthConfig {
  client_id: string;
  client_secret: string;
  auth_host: string;
}
export interface IConfig {
  redis: SessionOptions;
  mysql: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    synchronize: boolean;
  };
}

export default async (): Promise<IConfig> => {
  return {
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      name: process.env.REDIS_KEY,
      password: process.env.REDIS_PASSWORD || undefined,
    },
    mysql: {
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT) || 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'], // 这个会确定实体和数据表的对应关系
      synchronize: false,
    },

  };
};
