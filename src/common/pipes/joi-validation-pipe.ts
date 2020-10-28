import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ObjectSchema } from '@hapi/joi';

import { ValidationException } from '../exceptions';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);

    if (error) {
      const { details } = error;
      throw new ValidationException(details.map(({ type, context, ...rest }) => rest));
    }

    return value;
  }
}
