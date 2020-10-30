import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { IGoogleUser } from './interfaces/IGoogleUser';
import {User, AuthType, UserRole} from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  async create(userData: Partial<User>, authType: AuthType = AuthType.web) {

    if(userData.password) {
      const salt = await bcrypt.genSalt();
      userData.password = await this.hashString(userData.password, salt);
      userData.mailConfirmationHashString = await this.hashString(userData.email, salt);
    }

    userData.authType = authType;
    const newUser = await this.repo.save(this.repo.create(userData));

    return this.clearData(newUser);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ email });
  }

  async getOrCreateGoogleUser(userData: IGoogleUser) {
    const { email, googleId } = userData;
    let user = await this.repo.findOne({ where: [{ email }, { googleId }] });

    if(!user) {
      Object.assign(userData, { role: UserRole.parent, emailConfirmed: true, authType: AuthType.google });
      user = await this.repo.save(this.repo.create(userData));
    }

    if(user.googleId) {
      user.googleId = googleId;
      await this.repo.save(user);
    }

    return this.clearData(user);
  }

  private async hashString(rawString, salt): Promise<string> {
    return bcrypt.hash(rawString, salt);
  }

  private clearData(user: User): Partial<User> {
    const { password, googleId, ...userData } = user;
    return userData;
  }
}
