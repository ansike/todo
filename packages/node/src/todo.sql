CREATE USER IF NOT EXISTS todo_user IDENTIFIED BY 'todopw';
CREATE DATABASE IF NOT EXISTS todo_db DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
GRANT ALL ON todo_db.* TO todo_user @'%';
flush privileges;
USE todo_db;
-- 用户表
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` char(36) NOT NULL COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户账号/用户名',
  `nickname` VARCHAR(50) NOT NULL COMMENT '用户昵称',
  `email` VARCHAR(50) NOT NULL COMMENT '用户邮箱',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`username`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '用户表';

-- 任务表
DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `id` char(36) NOT NULL COMMENT '任务ID',
  `title` varchar(255) NOT NULL COMMENT '任务标题',
  `description` text COMMENT '任务描述',
  `creator_id` char(36) NOT NULL COMMENT '创建者ID',
  `assignee_id` char(36) DEFAULT NULL COMMENT '指派者ID',
  `plan_finish_time` timestamp DEFAULT '1970-01-01 00:00:01' COMMENT '计划完成时间',
  `actual_finish_time` timestamp DEFAULT '1970-01-01 00:00:01' COMMENT '实际完成时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '任务表';

-- 任务历史记录表
DROP TABLE IF EXISTS `task_history`;
CREATE TABLE IF NOT EXISTS `task_history` (
  `id` char(36) NOT NULL COMMENT '历史记录ID',
  `task_id` char(36) NOT NULL COMMENT '任务ID',
  `operator_id` char(36) NOT NULL COMMENT '操作者ID',
  `operation` varchar(50) NOT NULL COMMENT '操作类型',
  `result` text COMMENT '操作结果',
  `operation_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '任务历史记录表';


-- 任务参与人表
CREATE TABLE IF NOT EXISTS `task_member` (
  `id` char(36) NOT NULL COMMENT '参与人ID',
  `task_id` char(36) NOT NULL COMMENT '任务ID',
  `member_id` char(36) NOT NULL COMMENT '成员ID',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '任务参与人表';

-- 评论表
CREATE TABLE IF NOT EXISTS `comment` (
  `id` char(36) NOT NULL COMMENT '评论ID',
  `task_id` char(36) NOT NULL COMMENT '任务ID',
  `commentor_id` char(36) NOT NULL COMMENT '评论者ID',
  `content` text NOT NULL COMMENT '评论内容',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '评论表';
-- @他人表
CREATE TABLE IF NOT EXISTS `mention` (
  `id` char(36) NOT NULL COMMENT '@ID',
  `comment_id` char(36) NOT NULL COMMENT '评论ID',
  `mention_id` char(36) NOT NULL COMMENT '被@者ID',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '@他人表';
-- 消息提醒表
CREATE TABLE IF NOT EXISTS `notification` (
  `id` char(36) NOT NULL COMMENT '提醒ID',
  `receiver_id` char(36) NOT NULL COMMENT '接收者ID',
  `content` text NOT NULL COMMENT '提醒内容',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `type` int NOT NULL COMMENT '提醒类型',
  `is_read` boolean NOT NULL DEFAULT false COMMENT '是否已读',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '消息提醒';