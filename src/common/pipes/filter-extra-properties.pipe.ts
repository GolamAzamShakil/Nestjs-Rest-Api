/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FilterExtraPropertiesPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || typeof value !== 'object') {
      return value;
    }

    const filtered: any = {};

    for (const [key, val] of Object.entries(value)) {
      const type = typeof val;

      // Allow only string and number
      if (type === 'string' || type === 'number') {
        filtered[key] = val;
      } else if (type === 'object' && val !== null) {
        // Reject nested objects/arrays
        throw new BadRequestException(
          `Property "${key}" must be a string or number, not ${type}`,
        );
      }
      // Skip null, undefined, boolean, etc.
    }

    return filtered;
  }
}
