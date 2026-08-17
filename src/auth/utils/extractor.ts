/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ExtractJwt } from 'passport-jwt';
import { SessionRequest } from 'src/common/interfaces';

export const accessTokenExtractor = (req: SessionRequest): string | null => {
  if (!req) return null;

  if (req.cookies?.accessToken) {
    req.authType = 'cookie';

    return req.cookies.accessToken;
  }

  const auth = req.headers.authorization;

  if (auth?.startsWith('Bearer ')) {
    req.authType = 'bearer';

    return auth.substring(7);
  }

  return null;
};

export const accessExtractor = ExtractJwt.fromExtractors([
  accessTokenExtractor,
]);
