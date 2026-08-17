/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class LoggingPipe implements PipeTransform {
  private readonly logger = new Logger(LoggingPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.log(`Incoming ${metadata.type}: ${JSON.stringify(value)}`);
    return value;
  }
}
