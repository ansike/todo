import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { PaginatedUsers } from './user.controller';
import { User } from './user.entity';
export const userKeys: (keyof User)[] = [
  'id',
  'username',
  'nickname',
  'email',
  'created_at',
  'updated_at',
];

const salt = bcrypt.genSaltSync(10);
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(page: number, limit: number): Promise<PaginatedUsers> {
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      select: userKeys,
    });
    return { total, data };
  }

  async findOne(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      select: userKeys,
    });
  }

  async create(user: User): Promise<User> {
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    const newUser = await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });
    delete newUser.password;
    return newUser;
  }

  async update(id: string, updateUser: User): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return undefined;
    }

    user.username = updateUser.username || user.username;
    user.nickname = updateUser.nickname || user.nickname;
    user.email = updateUser.email || user.email;
    user.password =
      (updateUser.password && bcrypt.hashSync(updateUser.password, salt)) ||
      user.email;

    const newUser = await this.userRepository.save(user);
    delete newUser.password;
    return newUser;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async isMatchedUser(
    username: string,
    password: string,
  ): Promise<User | string> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      return `不存在username为${username}的用户`;
    }
    
    if (bcrypt.compareSync(password, user.password)) {
      delete user.password;
      return user;
    }
    return `用户名或密码错误`;
  }
}
