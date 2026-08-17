import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { accessExtractor } from './extractor';
import { JwtConfig } from 'src/common/configs/jwt.config';
import { JwtPayload } from 'src/common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(jwtConfig: JwtConfig) {
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ]),
      jwtFromRequest: accessExtractor,

      ignoreExpiration: false,

      secretOrKey: jwtConfig.jwtAccessSecret,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid access token.');
    }

    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
