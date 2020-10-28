import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { AuthorizeMessages } from '../../common/exception-messages';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { SignInDTO } from './dto/signInDTO'
import { LogInDTO } from './dto/logInDTO'
import { JwtPayload } from './dto/jwtPayload'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  signIn(userDto: SignInDTO) {
    const { passwordConfirmation, ...userData } = userDto;
    return this.userService.create(userData);
  }

  async validateUser({ email, password }: LogInDTO): Promise<Partial<User> | any> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if(match) {
        const { password, ...userData } = user;
        return userData;
      }
    }
    return null;
  }

  async login(logInData: LogInDTO) {
    const user = await this.validateUser(logInData);

    if(!user) {
      throw new UnauthorizedException(AuthorizeMessages.wrongEmailOrPassword);
    }

    const payload: JwtPayload = { email: user.email, id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user
    }
  }
}
