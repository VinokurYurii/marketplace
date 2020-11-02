import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ObjectSchema } from '@hapi/joi';

import { ValidationException } from '../exceptions';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      const { details } = error;
      throw new ValidationException(details.map(({ type, context, path, ...rest }) => ({
        path: this.simplifyPath(path),
        ...rest,
      })));
    }

    return value;
  }

  simplifyPath(pathArray = []) {
    return pathArray.map(key => `${key}`).join('.');
  }
}
