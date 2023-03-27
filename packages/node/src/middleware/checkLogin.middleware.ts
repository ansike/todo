import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';
import get from 'lodash/get';

export function CheckLoginMiddleware(app) {
  const logger = new Logger('checklogin');
  return async function CheckLoginMiddlewareFunction(
    req: Request,
    res: Response,
    next: () => void,
  ) {
    const { query } = req;

    // 路由白名单判断
    if (!req.path.startsWith('/api')) {
      logger.log(`[whitePathList] path:${req.path}`);
      next();
      return;
    }

    if ((req as any).session && get(req, 'session.user')) {
      next();
    } else {
      const contentType = req.headers['content-type'];
      logger.log('未登录');
      if (
        contentType?.includes('application/json') ||
        req.path.match(/\/api/)
      ) {
        res.status(401).send('未登录');
      } else {
        // 避免 expressStaticGzip 缓存 redirect
        res.setHeader('Cache-Control', 'no-cache');
        res.redirect(
          `/login?redirect_uri=${encodeURIComponent(req.originalUrl)}`,
          302,
        );
      }
    }
  };
}
