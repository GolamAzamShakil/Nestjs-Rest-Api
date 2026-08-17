import { Injectable } from '@nestjs/common';
import { Response, CookieOptions } from 'express';
import { CookieConfig } from '../configs/cookie.config';
import { CookieUtil } from '../utils/cookie.util';

@Injectable()
export class CookieService {
  constructor(private readonly config: CookieConfig) {}

  private buildOptions(maxAge: number): CookieOptions {
    return {
      httpOnly: this.config.cookieHttp,

      secure: this.config.cookieSecure,

      sameSite: this.config.cookieSameSite,

      domain: this.config.cookieDomain || undefined,

      maxAge,

      path: '/',
    };
  }

  setAccessToken(response: Response, token: string): void {
    response.cookie(
      this.config.cookieAccessName,

      token,

      this.buildOptions(this.config.cookieMaxAccessAge),
    );
  }

  setRefreshToken(response: Response, token: string): void {
    response.cookie(
      this.config.cookieRefreshName,

      token,

      CookieUtil.createCookieOptions(
        this.config,
        this.config.cookieMaxRefreshAge,
      ),
    );
  }

  setTokens(
    response: Response,

    accessToken: string,

    refreshToken: string,
  ): void {
    this.setAccessToken(response, accessToken);

    this.setRefreshToken(response, refreshToken);
  }

  clearTokens(response: Response): void {
    const options = {
      domain: this.config.cookieDomain || undefined,

      path: '/',
    };

    response.clearCookie(this.config.cookieAccessName, options);

    response.clearCookie(this.config.cookieRefreshName, options);
  }
}
