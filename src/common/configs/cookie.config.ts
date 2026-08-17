import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class CookieConfig {
  constructor(private readonly config: ConfigService) {}

  get cookieDomain() {
    return this.config.getOrThrow<string>('COOKIE_DOMAIN');
  }

  get cookieHttp() {
    return this.config.getOrThrow<boolean>('COOKIE_HTTP_ONLY');
  }

  get cookieSecure() {
    return this.config.getOrThrow<boolean>('COOKIE_SECURE');
  }

  get cookieSameSite(): CookieOptions['sameSite'] {
    return this.config.getOrThrow<CookieOptions['sameSite']>(
      'COOKIE_SAME_SITE',
    );
  }

  get cookieMaxAccessAge() {
    return this.config.getOrThrow<number>('COOKIE_MAX_AGE_ACCESS');
  }

  get cookieMaxRefreshAge() {
    return this.config.getOrThrow<number>('COOKIE_MAX_AGE_REFRESH');
  }

  get cookieAccessName() {
    return this.config.getOrThrow<string>('COOKIE_ACCESS_NAME');
  }

  get cookieRefreshName() {
    return this.config.getOrThrow<string>('COOKIE_REFRESH_NAME');
  }
}
