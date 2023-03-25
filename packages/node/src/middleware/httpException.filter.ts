import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Response, Request } from 'express';


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('HttpException');
  }

  catch(e: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    this.logger.error(`code=${e?.code} status=${e?.status} Error=${e?.message}, Stack=${e?.stack}`);

    res.status(500).json(e.message);
  }
}
