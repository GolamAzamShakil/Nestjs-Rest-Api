/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Role, User } from 'prisma/generated/client';
import { UserMapper } from '../common/mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return UserMapper.toApiList(users);
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async getById(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return UserMapper.toApi(user);
  }

  async ensureEmailUnique(email: string) {
    const exists = await this.findByEmail(email);

    if (exists) {
      throw new ConflictException('Email already exists.');
    }
  }

  async ensureUsernameUnique(username: string) {
    const exists = await this.findByUsername(username);

    if (exists) {
      throw new ConflictException('Username already exists.');
    }
  }

  async create(data: Prisma.UserCreateInput) {
    await Promise.all([
      this.ensureEmailUnique(data.email),
      this.ensureUsernameUnique(data.username),
    ]);

    const user = await this.prisma.user.create({
      data,
    });

    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    await this.getById(id);

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return UserMapper.toApi(user);
  }

  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const matched = await bcrypt.compare(currentPassword, user.password);

    if (!matched) {
      throw new BadRequestException('Current password is incorrect.');
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashed,
      },
    });

    return true;
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    let hashed: string | null = null;

    if (refreshToken) {
      hashed = await bcrypt.hash(refreshToken, 10);
    }

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        hashedRefreshToken: hashed,
      },
    });
  }

  async verifyRefreshToken(id: string, refreshToken: string) {
    const user = await this.findById(id);

    if (!user || !user.hashedRefreshToken) {
      return false;
    }

    return bcrypt.compare(refreshToken, user.hashedRefreshToken);
  }

  async enableMfa(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isMfaEnabled: true,
      },
    });
  }

  async disableMfa(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isMfaEnabled: false,
      },
    });
  }

  async updateRoles(id: string, roles: Role[]) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        roles,
      },
    });

    return UserMapper.toApi(user);
  }

  async remove(id: string) {
    await this.getById(id);

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  }
}
