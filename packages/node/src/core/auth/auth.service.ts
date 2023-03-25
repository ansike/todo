import { Inject, Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async login(username: string, password: string): Promise<User | string> {
    return this.userService.isMatchedUser(username, password);
  }

}
