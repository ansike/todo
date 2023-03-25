import { Controller, Get } from '@nestjs/common';

@Controller()
export class TestController {
  @Get()
  async test() {
    return { a: 1 };
  }
}
