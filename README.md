# TODO LIST 实现

验证方式：
1. 一键启动方案
```shell
docker-compose up

# 访问 http://localhost:4001/
```

2. 本地启动代码
```shell
# 1. 存储使用mysql
docker run -d -p 3306:3306 --name todo-mysql -e MYSQL_ROOT_PASSWORD=todopw -d mysql:5.7
# 初始化数据库和部分数据
mysql -uroot -ptodopw -h127.0.0.1 < packages/node/src/todo.sql

# 2. 登录态使用redis
docker run -d -p 6379:6379 --name todo-redis -d redis

# 3. 安装依赖
yarn

# 4. 启动node
cd packages/node && yarn dev

# 5. 启动web
cd packages/web && yarn dev

# 访问 http://localhost:3000/
```

构建服务镜像
```
docker build -f Dockerfile.node -t todo-v1 .
```