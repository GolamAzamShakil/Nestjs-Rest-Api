import { CookieOptions } from 'express';
import { CookieConfig } from '../configs/cookie.config';

export class CookieUtil {
  static createCookieOptions(
    config: CookieConfig,
    maxAge: number,
  ): CookieOptions {
    return {
      httpOnly: config.cookieHttp,

      secure: config.cookieSecure,

      sameSite: config.cookieSameSite,

      domain: config.cookieDomain || undefined,

      path: '/',

      maxAge,
    };
  }
}

/* @Injectable()
export class CookieUtil {
  // constructor(config: ConfigService) {}

  static setAccessToken(res: Response, token: string) {
    res.cookie('accessToken', token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: 'lax',

      maxAge: 15 * 60 * 1000,
    });
  }

  static setRefreshToken(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: 'strict',

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  static clear(res: Response) {
    res.clearCookie('accessToken');

    res.clearCookie('refreshToken');
  }
} */
