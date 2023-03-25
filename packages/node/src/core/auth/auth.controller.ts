import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(
    @Session() session,
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<User | string> {
    const user = await this.authService.login(username, password);
    if (typeof user !== 'string') session.user = user;
    return user;
  }

  @Get('checkLogin')
  async checkLogin(@Session() session): Promise<User | string> {
    return session.user;
  }

  @Post('logout')
  async logout(@Session() session): Promise<string> {
    session.user = null;
    return 'success';
  }
}
