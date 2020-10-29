import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  async create(userData: Partial<User>) {
    const salt = await bcrypt.genSalt();
    userData.password = await this.hashString(userData.password, salt);
    userData.mailConfirmationHashString = await this.hashString(userData.email, salt);

    const newUser = await this.repo.save(this.repo.create(userData));
    const { password, ...clearUser } = newUser;

    return clearUser;
  }

  findByEmail(email: string) {
    return this.repo.findOne({ email });
  }

  private async hashString(rawString, salt): Promise<string> {
    return bcrypt.hash(rawString, salt);
  }
}
