/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { ConfigService } from '@nestjs/config';

@Controller('api')
export class ApiController {
  private ratelimit: Ratelimit;

  constructor(private configService: ConfigService) {
    this.ratelimit = new Ratelimit({
      redis: new Redis({
        url: this.configService.get<string>('UPSTASH_REDIS_REST_URL'),
        token: this.configService.get<string>('UPSTASH_REDIS_REST_TOKEN'),
      }),
      limiter: Ratelimit.tokenBucket(5, '2 h', 20),
    });
  }

  @Get('rate-limit-status')
  async getStatus(@Req() request: Request) {
    // Mimic your guard's identifier matching
    const user = (request as any).user;
    const identifier = user?.id
      ? `rate_limit:${user.id}`
      : `rate_limit:${request.ip}`;

    // upstash/ratelimit allows checking limits without reducing the token count
    const data = await this.ratelimit.getRemaining(identifier);

    return { remaining: data };
  }
}
