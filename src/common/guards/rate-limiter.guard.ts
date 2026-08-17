/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { SKIP_RATE_LIMIT_KEY } from '../decorators/skip-rate-limit.decorator';
import { ROLES_KEY } from 'src/roles/roles.constants';

@Injectable()
export class UpstashRateLimiterGuard implements CanActivate {
  private ratelimit: Ratelimit;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.ratelimit = new Ratelimit({
      redis: new Redis({
        url: this.configService.get<string>('UPSTASH_REDIS_REST_URL'),
        token: this.configService.get<string>('UPSTASH_REDIS_REST_TOKEN'),
      }),
      limiter: Ratelimit.tokenBucket(5, '2 h', 20),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 1. DECORATOR BYPASS: Check if @SkipRateLimit() is present on route or controller
    const skipRateLimit = this.reflector.getAllAndOverride<boolean>(
      SKIP_RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipRateLimit) {
      return true;
    }

    // 2. ROLE BYPASS: Skip if user is admin
    if (user?.roles?.includes('admin')) {
      return true;
    }

    // 3. ALTERNATIVE ROLE BYPASS
    const requirement = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requirement === 'admin') {
      return true;
    }

    // Fallback identifier if user object or ID is missing
    const identifier = user?.id
      ? `rate_limit:${user.id}`
      : `rate_limit:${request.ip}`;

    const { success, limit, reset, remaining } =
      await this.ratelimit.limit(identifier);

    const response = context.switchToHttp().getResponse();
    response.header('X-RateLimit-Limit', limit.toString());
    response.header('X-RateLimit-Remaining', remaining.toString());
    response.header('X-RateLimit-Reset', reset.toString());

    if (!success) {
      throw new HttpException(
        'Rate limit exceeded. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}

/* @Injectable()
export class UpstashRateLimiterGuard implements CanActivate {
  private ratelimit: Ratelimit;

  constructor(private configService: ConfigService) {
    this.ratelimit = new Ratelimit({
      redis: new Redis({
        url: this.configService.get<string>('UPSTASH_REDIS_REST_URL'),
        token: this.configService.get<string>('UPSTASH_REDIS_REST_TOKEN'),
      }),
      limiter: Ratelimit.slidingWindow(5, '10 s'), // Strict limit: 5 requests per 10s
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Populated by JwtAuthGuard

    // Check if roles array contains "user"
    const isUserRole = user?.roles?.includes('user');

    // If the JWT does NOT contain the "user" role, bypass rate limiting
    if (!isUserRole) {
      return true;
    }

    // Apply rate limiting tied specifically to their user ID
    const identifier = `rate_limit:${user.id}`;
    const { success, limit, reset, remaining } =
      await this.ratelimit.limit(identifier);

    const response = context.switchToHttp().getResponse();
    response.header('X-RateLimit-Limit', limit.toString());
    response.header('X-RateLimit-Remaining', remaining.toString());
    response.header('X-RateLimit-Reset', reset.toString());

    if (!success) {
      throw new HttpException(
        'Rate limit exceeded for standard users.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
} */
