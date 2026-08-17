/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountController } from '../controllers/account.controller';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'src/common/services/cookie.service';
import { AuthCookieInterceptor } from '../../common/interceptors/auth-cookie.interceptor';
import { JwtConfig } from 'src/common/configs/jwt.config';
import { CookieConfig } from 'src/common/configs/cookie.config';
import { JwtStrategy } from '../utils/jwt.strategy';
import { JwtRefreshStrategy } from '../utils/jwt-refresh.strategy';
import { RolesGuard } from 'src/roles/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RefreshAuthGuard } from '../guards/refresh-auth.guard';
import { CookieAndBearerGuard } from '../../common/guards/cookie-bearer.guard';

@Module({
  imports: [
    ConfigModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
    UsersModule,
    RolesModule,
  ],

  controllers: [AuthController, AccountController],

  providers: [
    AuthService,
    // TokenService,
    CookieService,
    AuthCookieInterceptor,

    JwtConfig,
    CookieConfig,

    JwtStrategy,
    JwtRefreshStrategy,

    RolesGuard,
    JwtAuthGuard,
    RefreshAuthGuard,
    CookieAndBearerGuard,
  ],

  exports: [AuthService, AuthCookieInterceptor, JwtModule, PassportModule], //TokenService
})
export class AuthModule {}

/* @Module({
  imports: [
    ConfigModule,

    PassportModule,

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
})
export class AuthModule {} */
