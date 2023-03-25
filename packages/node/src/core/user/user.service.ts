import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedUsers } from './user.controller';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(page: number, limit: number): Promise<PaginatedUsers> {
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    console.log(1);
    
    return { total, data };
  }

  async findOne(id: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async update(id: string, updateUser: User): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({id:updateUser.id});
    if (!user) {
      return undefined;
    }

    user.username = updateUser.username || user.username;
    user.nickname = updateUser.nickname || user.nickname;
    user.email = updateUser.email || user.email;

    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
