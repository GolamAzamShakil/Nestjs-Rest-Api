/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CookieAndBearerGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, ctx) {
    const req = ctx.switchToHttp().getRequest();

    if (!req.cookies?.accessToken) {
      throw new UnauthorizedException('Cookie required');
    }

    if (!req.headers.authorization) {
      throw new UnauthorizedException('Bearer token required');
    }

    return user;
  }
}
