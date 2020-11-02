import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT_STRATEGY } from './jwt.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY) {
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
