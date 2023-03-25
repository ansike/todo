import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const logger = new Logger('LoggingMiddleware');
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    logger.log(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
    next();
  }
}
