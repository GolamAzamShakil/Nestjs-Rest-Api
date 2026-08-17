import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfig {
  constructor(private readonly config: ConfigService) {}

  get jwtAccessSecret() {
    return this.config.getOrThrow<string>('JWT_SECRET');
  }

  get jwtRefreshSecret() {
    return this.config.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  get jwtAccessExpiry() {
    return this.config.getOrThrow<string>('JWT_ACCESS_EXPIRES');
  }

  get jwtRefreshExpiry() {
    return this.config.getOrThrow<string>('JWT_REFRESH_EXPIRES');
  }
}
