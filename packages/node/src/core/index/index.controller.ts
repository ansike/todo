import { Controller, Get, Res, Req, Inject } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller()
export class IndexController {

  @Get()
  async index(@Req() req: Request, @Res() res: Response) {
    res.end('index');
  }
}
