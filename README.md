# TODO LIST 实现

存储使用mysql
```shell
# 本期启动一个mysql的docker服务
docker run -d -p 3306:3306 --name todo-mysql -e MYSQL_ROOT_PASSWORD=todopw -d mysql:5.7
# 连接数据库
mysql -uroot -ptodopw -h127.0.0.1
# 创建user和数据库
mysql -uroot -ptodopw -h127.0.0.1 < packages/node/src/todo.sql
```

登录态使用redis
```shell
docker run -d -p 6379:6379 --name todo-redis -d redis

```