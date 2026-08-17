/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { CookieService } from 'src/common/services/cookie.service';

@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
  constructor(private readonly cookieService: CookieService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        // Look for tokens in the service return values
        if (data && data.accessToken && data.refreshToken) {
          this.cookieService.clearTokens(response);

          this.cookieService.setTokens(
            response,
            data.accessToken,
            data.refreshToken,
          );

          delete data.accessToken;
          delete data.refreshToken;
        }
        return data;
      }),
    );
  }
}
