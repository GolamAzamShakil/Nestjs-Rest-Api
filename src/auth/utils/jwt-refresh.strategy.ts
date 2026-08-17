import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { refreshExtractor } from './refresh-extractor';
import { JwtPayload } from 'src/common/interfaces';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      //   jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      jwtFromRequest: refreshExtractor,

      ignoreExpiration: false,

      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
