import session from 'express-session';
import connectRedis from 'connect-redis';
import express from 'express';
import redis from 'redis';
import { Logger } from '@nestjs/common';

const logger = new Logger('redisMiddleware');
const RedisStore = connectRedis(session);

export type SessionOptions = {
  host: string; // redis host
  port: number; // redis port
  secret?: string; // session存储secret
  name?: string; // Cookie Name
  password?: string; // redis password
};

export function SessionMiddleware(
  options: SessionOptions,
): express.RequestHandler {
  const { name, secret } = options;
  const { host, port, password } = options;

  const pwd = password || undefined;

  logger.log(`create client: host: ${host}, port: ${port}`);
  logger.debug(`create client: password: ${pwd}`);

  const redisClientOptions = {
    host,
    port,
    password: pwd,
    retry_strategy: (options) => {
      logger.error(
        `retry_strategy error: ${JSON.stringify(options.error)} \
        total_retry_time: ${options.total_retry_time} \
        times_connected: ${options.times_connected} \
        attempt:${options.attempt}`,
      );
      return Math.min(options?.attempt * 100, 3000);
    },
  };

  const redisClient = redis.createClient(redisClientOptions);
  const store = new RedisStore({ client: redisClient });

  return session({
    name,
    store,
    secret: secret || 'x-secret-xxx',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  });
}
