/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RateLimitPipe implements PipeTransform {
  private readonly requestCounts = new Map<string, number>();

  async transform(value: any, metadata: ArgumentMetadata) {
    /* const ip = metadata.data?.ip || 'unknown';
    const count = this.requestCounts.get(ip) || 0;

    if (count > 10) {
      throw new TooManyRequestsException('Rate limit exceeded');
    }

    this.requestCounts.set(ip, count + 1); */
    return value;
  }
}
