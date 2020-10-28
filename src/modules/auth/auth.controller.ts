import { Controller, Post,  Body, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JoiValidationPipe } from '../../common/pipes/joi-validation-pipe'
import { SignInDTO, SignInSchema } from './dto/signInDTO'
import { LogInDTO, LogInSchema } from './dto/logInDTO'
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Post('login')
  login(@Body(new JoiValidationPipe(LogInSchema)) logInDTO: LogInDTO) {
    return this.service.login(logInDTO);
  }

  @Post('sign-in')
  signIn(@Body(new JoiValidationPipe(SignInSchema)) userDto: SignInDTO) {
    return this.service.signIn(userDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('test')
  test(@Request() req) {
    console.log('req.user  => ', req.user);
    return req.user;
  }
}
