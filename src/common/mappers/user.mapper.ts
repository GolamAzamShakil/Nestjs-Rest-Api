/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { User } from 'prisma/generated/client';
import { ApiUserResponse } from '../interfaces';

export class UserMapper {
  static toApi(user: User): ApiUserResponse {
    return {
      id: user.id,

      username: user.username,

      email: user.email,

      roles: user.roles,

      isMfaEnabled: user.isMfaEnabled,

      createdAt: user.createdAt,

      updatedAt: user.updatedAt,
    };
  }

  static toApiList(users: User[]): ApiUserResponse[] {
    return users.map((user) => this.toApi(user));
  }

  static toApiWithoutPassword(user: User): Omit<User, 'password'> {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  static toApiwithoutPasswordList(users: User[]): Omit<User, 'password'>[] {
    return users.map((user) => this.toApiWithoutPassword(user));
  }
}


// Need to create these static methods as well- UserMapper.toAuthenticatedUser() and UserMapper.toJwtPayload()