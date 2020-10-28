import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';

import { ValidationMessages } from '../../../common/exception-messages';
import { User, UserRole } from '../../user/user.entity';

export class SignInDTO {
  @ApiProperty({ example: 'example@com.ua' })
  email: string;

  @ApiProperty({ example: '123456789' })
  password: string;

  @ApiProperty({ example: '123456789' })
  passwordConfirmation: string;

  @ApiProperty({ example: '+3 987654321' })
  phone: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: UserRole.parent })
  role: UserRole;
}

export const SignInSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
  passwordConfirmation: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': ValidationMessages.passwordConfirmation
  }),
  phone: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid(...User.userRoles.publicCreateAllowed).required(),
});
