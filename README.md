# TODO LIST 实现

验证方式：
1. 一键启动方案
```shell
docker-compose up

# 访问 http://localhost:4001/
# 内置了两个用户，用户名是A1，A2密码都是 xxxxx
# 支持调用接口CRUD用户 文档站 http://localhost:4001/doc/
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

```shell
# 创建用户示例
curl --location --request POST 'http://localhost:4001/api/user' \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3A5lHr0TXuqIvAmApB-lLkU3RW2syC09qD.%2BhiMkc8dW%2FfCQOIdMmKC8lhBd05rr7moQRPxbp1ov6o; tenant=s%3AfSfMo3bQmchNyXzmEgGUrYeIx6gzJ_Vv.3QtYSczToYea7X7qk%2Bf6tbyoMrY%2BGUnB8oczzxJLMGM' \
--data-raw '{
    "username": "A2",
    "nickname": "A2",
    "email": "A@qq.com",
    "password": "xxxxxx"
}'
```