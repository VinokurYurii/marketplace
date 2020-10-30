import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';

export const GOOGLE_STRATEGY = 'google';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_STRATEGY) {

  constructor(
    configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      ...configService.getGooglePassportConfig(),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails } = profile;
    const user = await this.authService.logInGoogleUser(
      {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        googleId: id,
        // accessToken
      }
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    done(null, user);
  }
}
