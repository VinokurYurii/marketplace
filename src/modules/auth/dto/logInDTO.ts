import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';

export class LogInDTO {
  @ApiProperty({ example: 'example@com.ua' })
  email: string;

  @ApiProperty({ example: '123456789' })
  password: string;
}

export const LogInSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
});
