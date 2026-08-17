/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ExtractJwt } from 'passport-jwt';
import { SessionRequest } from 'src/common/interfaces';

export const refreshTokenExtractor = (req: SessionRequest): string | null => {
  if (!req) return null;

  if (req.cookies?.refreshToken) {
    req.authType = 'cookie';

    return req.cookies.refreshToken;
  }

  const auth = req.headers.authorization;

  if (auth?.startsWith('Bearer ')) {
    req.authType = 'bearer';

    return auth.substring(7);
  }

  if (req.body?.refreshToken) {
    req.authType = 'bearer';

    return req.body.refreshToken;
  }

  return null;
};

export const refreshExtractor = ExtractJwt.fromExtractors([
  refreshTokenExtractor,
]);
