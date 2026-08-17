/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '../../common/configs/jwt.config';
import { StringValue } from 'ms';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../dtos/signin.dto';
import { SignupInputsDto } from '../dtos/signup-inputs.dto';
import { User } from 'prisma/generated/client';
import { UsersService } from 'src/users/users.service';
import { UserMapper } from 'src/common/mappers/user.mapper';
import { CookieService } from '../../common/services/cookie.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly cookie: CookieService,
    private readonly users: UsersService,
    private readonly config: ConfigService,
    private readonly jwtConfig: JwtConfig,
  ) {}

  async generateTokens(user: User) {
    const payload = {
      sub: user.id, // as string,
      email: user.email, // as string,
      roles: user.roles, // as Role[],
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          ...payload,
          type: 'access',
        },
        {
          secret: this.jwtConfig.jwtAccessSecret,
          expiresIn: this.jwtConfig.jwtAccessExpiry as StringValue,
        },
      ),
      this.jwt.signAsync(
        {
          ...payload,
          type: 'refresh',
        },
        {
          secret: this.jwtConfig.jwtRefreshSecret,
          expiresIn: this.jwtConfig.jwtRefreshExpiry as StringValue,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.users.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new UnauthorizedException();

    return user;
  }

  async signin(dto: SignInDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const userWithoutPassword = UserMapper.toApiWithoutPassword(user);

    const tokens = await this.generateTokens(user);

    return {
      userWithoutPassword,
      ...tokens,
    };
  }

  async signup(dto: SignupInputsDto) {
    await this.users.ensureEmailUnique(dto.email);

    const hash = await bcrypt.hash(dto.password, 12);

    const newUser = await this.users.create({
      username: dto.username,
      email: dto.email,
      password: hash,
      roles: dto.roles,
      isMfaEnabled: dto.isMfaEnabled,
    });

    const tokens = await this.generateTokens(newUser);
    const newUserWithoutPassword = UserMapper.toApiWithoutPassword(newUser);

    return {
      newUserWithoutPassword,
      ...tokens,
    };
  }

  signout(response: Response) {
    this.cookie.clearTokens(response);
    return { message: 'Signed out successfully' };
  }

  async refresh(userId: string) {
    const user = await this.users.findById(userId);

    if (!user) throw new UnauthorizedException();

    const { refreshToken, accessToken } = await this.generateTokens(user);

    return { refreshToken, accessToken };
  }
}

/* generateAccessToken(user: User) {
  return this.jwt.sign({
    sub: user.id,

    email: user.email,

    roles: user.roles,

    type: 'access',
  });
}

generateRefreshToken(user: User) {
  return this.jwt.sign(
    {
      sub: user.id,

      email: user.email,

      roles: user.roles,

      type: 'refresh',
    },
    {
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),

      expiresIn: '7d',
    },
  );
} */

/* @Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: Omit<JwtPayload, 'type'>) {
    return this.jwtService.sign({
      ...payload,
      type: 'access',
    });
  }

  generateRefreshToken(payload: Omit<JwtPayload, 'type'>) {
    return this.jwtService.sign(
      {
        ...payload,
        type: 'refresh',
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify<JwtPayload>(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }
} */
