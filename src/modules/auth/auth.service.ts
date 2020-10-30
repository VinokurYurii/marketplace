import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { AuthorizeMessages } from '../../common/exception-messages';
import { UserService } from '../user/user.service';
import { IGoogleUser } from '../user/interfaces/IGoogleUser';
import { User, AuthType } from '../user/user.entity';
import { SignInDTO } from './dto/signInDTO'
import { LogInDTO } from './dto/logInDTO'
import { JwtPayload } from './dto/jwtPayload'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async signIn(userDto: SignInDTO) {
    const { passwordConfirmation, ...userData } = userDto;
    return this.userService.create(userData, AuthType.web);
  }

  async validateUser({ email, password }: LogInDTO): Promise<Partial<User> | any> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if(match) {
        return user;
      }
    }
    return null;
  }

  async logInGoogleUser(userData: IGoogleUser) {
    const user = await this.userService.getOrCreateGoogleUser(userData);

    if(!user) {
      return null;
    }

    return this.getSignUserData(user);
  }

  async login(logInData: LogInDTO) {
    const user = await this.validateUser(logInData);

    if(!user) {
      throw new UnauthorizedException(AuthorizeMessages.wrongEmailOrPassword);
    }

    return this.getSignUserData(user);
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
  }

  private getSignUserData(user: Partial<User>) {
    const payload: JwtPayload = { email: user.email, id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user
    }
  }
}
